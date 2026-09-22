#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <objc/message.h>
#import <objc/runtime.h>
#import <limits>
#import "NSString+RNSUtility.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSScreenWindowTraits.h"
#import "RNSTabsHostComponentView.h"
#import "RNSTabsNavigationStateObserverRegistry.h"

#define RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE !TARGET_OS_TV && !TARGET_OS_VISION

/// Whether the build SDK can see the `UITab` symbols at all, and whether the platform is one we
/// migrate. The basic `UITab` API requires only an iOS 18 SDK - the 26.1 requirement below is a
/// *runtime* policy, not an SDK one.
#define RNS_TABS_UITAB_API_SDK_AVAILABLE RNS_IPHONE_OS_VERSION_AVAILABLE(18_0) && !TARGET_OS_TV && !TARGET_OS_VISION

/// Runtime cutoff for the `UITab` configuration path. 26.1 is the first version exposing
/// `UITab.selectedImage`, i.e. the first version at which we have appearance parity with
/// the `UITabBarItem`-based path. Written as a macro so that Clang's availability analysis
/// still sees a literal `@available` at every usage site.
#define RNS_TABS_UITAB_RUNTIME_AVAILABLE @available(iOS 26.1, *)

// https://developer.apple.com/documentation/uikit/uitabbarcontroller?language=objc#The-More-navigation-controller
static constexpr NSUInteger kMinCountOfVCsForMoreVCPresence = 6;

// We need UINavigationControllerDelegate to handle navigation within `moreNavigationController`
@interface RNSTabBarController () <UITabBarControllerDelegate, UINavigationControllerDelegate>
@end

@interface RNSTabBarController ()

/// Consulted by the ISA-swizzled `pushViewController:animated:` on `moreNavigationController`
/// to decide whether a push should proceed.
- (BOOL)moreNavigationController:(UINavigationController *)navigationController
        shouldPushViewController:(UIViewController *)viewController;

@property (nonatomic, readwrite) BOOL shouldProgressStateOnMoreNavigationControllerPush;

@end

#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
/**
 * Replacement implementation for `pushViewController:animated:` injected into
 * a dynamic subclass of `UIMoreNavigationController` via ISA-swizzle.
 *
 * Before allowing the push, this function consults the owning `RNSTabBarController`
 * (reached via UIKit's `tabBarController` property on the parent chain)
 * to check whether the push should be prevented (e.g. due to `preventNativeSelection`).
 */
static void rns_pushViewController(__unsafe_unretained id self,
                                   SEL _cmd,
                                   UIViewController *viewController,
                                   BOOL animated)
{
  UITabBarController *rawTabBarController = static_cast<UIViewController *>(self).tabBarController;

  RCTAssert([rawTabBarController isKindOfClass:RNSTabBarController.class],
            @"[RNScreens] Expected tabBarController to be of class %@, got: %@",
            RNSTabBarController.class,
            rawTabBarController.class);
  RNSTabBarController *tabBarController = static_cast<RNSTabBarController *>(rawTabBarController);

  if ([tabBarController moreNavigationController:self shouldPushViewController:viewController]) {
    struct objc_super superInfo = {
        .receiver = self,
        .super_class = class_getSuperclass(object_getClass(self)),
    };
    const auto msgSendSuperPushViewController =
        reinterpret_cast<void (*)(struct objc_super *, SEL, UIViewController *, BOOL)>(objc_msgSendSuper);

    [tabBarController setShouldProgressStateOnMoreNavigationControllerPush:YES];
    msgSendSuperPushViewController(&superInfo, _cmd, viewController, animated);
  }
}
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _tabScreenControllers;

  /// Controllers currently installed in UIKit, as opposed to `_tabScreenControllers`, which is the
  /// pending React-supplied list. The two differ between `childViewControllersHaveChangedTo:` and
  /// the following container update. Only used on the `UITab` path - the legacy path reads
  /// `UITabBarController.viewControllers` directly, which stays authoritative there.
  NSArray<RNSTabsScreenViewController *> *_Nullable _installedScreenControllers;

  /// This property is nullable until first container update. Later it MUST NOT be nil.
  RNSTabsNavigationState *_Nullable _navigationState;

  /// Holds last state that has been a result of UI-side navigation (user request).
  /// This one is also updated in cases where UIKit modifies the selected tab implicitly,
  /// e.g. when user resizes the app and more tab disappears.
  ///
  /// This property is nullable until first container update. Later it MUST NOT be nil.
  RNSTabsNavigationState *_Nullable _lastUINavigationState;

  RNSTabsNavigationStateUpdateRequest *_Nullable _pendingStateUpdate;

  /// When YES, the controller is inside an explicit selection-changing code path (container update,
  /// delegate handling). Setter overrides skip reconciliation while this flag is set.
  BOOL _isHandlingExplicitSelectionUpdate;

  /// UITab path only. Set when `tabBarController:shouldSelectTab:` admits a user-driven selection,
  /// cleared by the matching `didSelectTab:previousTab:`. Needed because UIKit ALSO fires
  /// `didSelectTab:previousTab:` while `setTabs:` installs children, where the legacy
  /// `didSelectViewController:` has no counterpart and no state must be progressed.
  BOOL _isHandlingUserTabSelection;

  RNSTabsNavigationStateObserverRegistry *_observerRegistry;

  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
}

- (instancetype)init
{
  if (self = [super init]) {
    _tabScreenControllers = nil;
    _installedScreenControllers = nil;
    _tabBarAppearanceCoordinator = [RNSTabBarAppearanceCoordinator new];
    _tabsHostComponentView = nil;
    _navigationState = nil;
    _pendingStateUpdate = nil;
    _shouldProgressStateOnMoreNavigationControllerPush = NO;
    _isHandlingUserTabSelection = NO;
    _observerRegistry = [RNSTabsNavigationStateObserverRegistry new];
    _parentContainerRegistry = [RNSParentContainerItemRegistry new];

    // Delegate field retains weakly, no risk of cycle.
    self.delegate = self;
  }
  return self;
}

#pragma mark - Public API

- (void)submitSelectionOfTabsScreenWithKey:(nonnull NSString *)screenKey
{
  RCTAssert(screenKey != nil, @"[RNScreens] Requested screenKey MUST NOT be nil");
  int baseProvenance = _navigationState != nil ? _navigationState.provenance : std::numeric_limits<int>::min();
  RNSTabsNavigationStateUpdateRequest *request =
      [RNSTabsNavigationStateUpdateRequest requestWithSelectedScreenKey:screenKey
                                                         baseProvenance:baseProvenance
                                                           actionOrigin:RNSTabsActionOriginProgrammaticNative];
  [self setPendingNavigationStateUpdate:request];
}

- (void)flushPendingUpdates
{
  [self performContainerUpdate];
}

- (BOOL)addNavigationStateObserver:(id<RNSTabsNavigationStateObserver>)observer
{
  return [_observerRegistry addObserver:observer];
}

- (BOOL)removeNavigationStateObserver:(id<RNSTabsNavigationStateObserver>)observer
{
  return [_observerRegistry removeObserver:observer];
}

- (void)tearDown
{
  [_observerRegistry clear];
  _pendingStateUpdate = nil;
  _tabsHostComponentView = nil;
}

- (instancetype)initWithTabsHostComponentView:(nullable RNSTabsHostComponentView *)tabsHostComponentView
{
  if (self = [self init]) {
    _tabsHostComponentView = tabsHostComponentView;
  }
  return self;
}

#pragma mark - RNSContainer

- (nullable UIScrollView *)resolveCurrentContentScrollView
{
  // `selectedViewController` may be the `moreNavigationController` (a `UINavigationController`) -
  // we only resolve for our own tab screens.
  UIViewController *selectedController = [self selectedScreenController];
  if (![selectedController isKindOfClass:RNSTabsScreenViewController.class]) {
    return nil;
  }
  return [static_cast<RNSTabsScreenViewController *>(selectedController) findContentScrollView];
}

- (void)attachToParentContainerItem
{
  [_parentContainerRegistry attachContainer:self];
}

- (void)detachFromParentContainerItem
{
  [_parentContainerRegistry detachContainer:self];
}

#pragma mark - UIKit callbacks

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  [super didMoveToParentViewController:parent];

  if (parent != nil) {
    [self updateLayoutDirectionBelowIOS17IfNeeded];
    [self attachToParentContainerItem];
  } else {
    [self detachFromParentContainerItem];
  }
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
  RNSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
  NSLog(@"[RNS-PROBE] tabBar:didSelectItem: %@", item.title);
}

- (void)setSelectedIndex:(NSUInteger)selectedIndex
{
  NSLog(@"[RNS-PROBE] setSelectedIndex: %lu (explicit=%d)",
        (unsigned long)selectedIndex,
        _isHandlingExplicitSelectionUpdate);
  [super setSelectedIndex:selectedIndex];
  if (!_isHandlingExplicitSelectionUpdate) {
    [self reconcileNavigationStateWithUIKitState];
  }
}

- (void)setSelectedViewController:(__kindof UIViewController *)selectedViewController
{
  NSLog(@"[RNS-PROBE] setSelectedViewController: %@ (explicit=%d)",
        NSStringFromClass(selectedViewController.class),
        _isHandlingExplicitSelectionUpdate);
  [super setSelectedViewController:selectedViewController];
  if (!_isHandlingExplicitSelectionUpdate) {
    [self reconcileNavigationStateWithUIKitState];
  }
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];

  UIViewController *selectedController = [self selectedScreenController];

  if (previousTraitCollection == nil || selectedController == nil) {
    return;
  }

  if (self.traitCollection.horizontalSizeClass != previousTraitCollection.horizontalSizeClass &&
      [self isViewControllerHostedByMoreNavigationController:selectedController]) {
    [self disableNavigationBarInMoreNavigationController];
  }
}

#pragma mark - Signals

- (void)setPendingNavigationStateUpdate:(nullable RNSTabsNavigationStateUpdateRequest *)stateUpdate
{
  _pendingStateUpdate = stateUpdate;
}

- (void)childViewControllersHaveChangedTo:(NSArray<RNSTabsScreenViewController *> *)reactChildControllers
{
  _tabScreenControllers = reactChildControllers;
  self.needsUpdateOfChildViewControllers = true;
}

- (void)setNeedsUpdateOfChildViewControllers:(bool)needsReactChildrenUpdate
{
  _needsUpdateOfChildViewControllers = true;
}

- (void)setNeedsUpdateOfTabBarAppearance:(bool)needsUpdateOfTabBarAppearance
{
  _needsUpdateOfTabBarAppearance = needsUpdateOfTabBarAppearance;
}

- (void)setNeedsOrientationUpdate:(bool)needsOrientationUpdate
{
  _needsOrientationUpdate = needsOrientationUpdate;
}

- (void)setNeedsLayoutDirectionUpdateBelowIOS17:(bool)needsLayoutDirectionUpdate
{
  _needsLayoutDirectionUpdateBelowIOS17 = needsLayoutDirectionUpdate;
}

#pragma mark - RNSReactMountingTransactionObserving

- (void)reactMountingTransactionWillMount
{
  RNSLog(@"TabBarCtrl mountintTransactionWillMount");
}

- (void)reactMountingTransactionDidMount
{
  RNSLog(@"TabBarCtrl mountintTransactionDidMount running updates");
  [self performContainerUpdate];
}

#pragma mark - Container update

- (void)performContainerUpdate
{
  _isHandlingExplicitSelectionUpdate = YES;
  [self updateChildViewControllersIfNeeded];
  [self updateSelectedViewControllerIfNeeded];
  _isHandlingExplicitSelectionUpdate = NO;

  [self updateTabBarAppearanceIfNeeded];
  [self updateTabBarA11yIfNeeded];
  [self updateOrientationIfNeeded];
}

/**
 * Update UIKit model and associated navigation state.
 *
 * This method will advance state in case the selected view controller is repeated.
 *
 * This method MUST be called only in situations where `UITabBarController` state has not been updated yet.
 * Otherwise it'll progress the state incorrectly.
 *
 * @returns whether the state has been updated or not.
 */
- (BOOL)updateSelectedViewControllerTo:(nullable UIViewController *)nextSelectedViewController
                               withKey:(nullable NSString *)screenKey
                          actionOrigin:(RNSTabsActionOrigin)actionOrigin
{
  if (nextSelectedViewController == nil) {
    return NO;
  }

  UIViewController *currSelectedViewController = [self selectedScreenController];

  RCTAssert(![NSString rnscreens_isBlankOrNull:screenKey],
            @"[RNScreens] The screenKey MUST NOT be null if the view controller is not null");

  [self progressNavigationState:screenKey withOrigin:actionOrigin];

  if (currSelectedViewController == nextSelectedViewController) {
    return YES;
  }

  [self applySelectedScreenController:nextSelectedViewController];
  return YES;
}

/**
 * Update tabs navigation state in reaction to UIKit model update.
 *
 * This method does not update the UIKit model. It assumes that exactly one model update happened,
 * and will sync the state with the UIKit and progress the provenance.
 */
- (void)updateNavigationStateOnModelUpdate
{
  [self progressNavigationState:[self screenKeyForSelectedViewController] withOrigin:RNSTabsActionOriginUser];
}

- (void)userDidRepeatViewControllerSelection:(nonnull UIViewController *)viewController
{
  RCTAssert([self selectedScreenController] == viewController,
            @"[RNScreens] Expected UIKit to update selectedViewController");

  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    // We don't want to run neither state update nor side effects.
    return;
  }

  [self updateNavigationStateOnModelUpdate];

  // After state progression we trigger the special effect.
  BOOL repeatedSelectionHandledBySpecialEffect = [[self selectedScreenViewController] tabScreenSelectedRepeatedly];

  auto *updateContext =
      [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                         isRepeated:YES
                                          hasTriggeredSpecialEffect:repeatedSelectionHandledBySpecialEffect
                                                       actionOrigin:RNSTabsActionOriginUser];
  [_observerRegistry emitDidUpdateStateTo:_navigationState withContext:updateContext sender:self];
}

- (void)userDidSelectViewController:(nonnull UIViewController *)viewController
{
  // At this moment the `UITabBarController` model is already updated.
  RCTAssert([self selectedScreenController] == viewController,
            @"[RNScreens] Expected UIKit to update selectedViewController");

  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    [self disableNavigationBarInMoreNavigationController];
    [self prepareForMoreNavigationControllerHandlingIfNeeded];

    // We don't want to progress state in case a user selected the more navigation controller.
    // Instead, we emit a dedicated event so JS knows the More tab was tapped.
    [_observerRegistry emitDidSelectMoreTabWithCurrentState:_navigationState sender:self];
  } else {
    [self updateNavigationStateOnModelUpdate];
    auto *updateContext = [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                                             isRepeated:NO
                                                              hasTriggeredSpecialEffect:NO
                                                                           actionOrigin:RNSTabsActionOriginUser];
    [_observerRegistry emitDidUpdateStateTo:_navigationState withContext:updateContext sender:self];
  }
}

- (void)onDidPreventUserFromSelectingViewControllerWithKey:(nonnull NSString *)screenKey
{
  [_observerRegistry emitPreventedSelectionOf:screenKey currentState:_navigationState sender:self];
}

- (BOOL)shouldPreventNativeViewControllerSelection:(nonnull UIViewController *)nextViewController
{
  if (![nextViewController isKindOfClass:RNSTabsScreenViewController.class]) {
    // Allow for more view controller selection
    return NO;
  }

  auto *screenViewController = static_cast<RNSTabsScreenViewController *>(nextViewController);
  return screenViewController.isPreventNativeSelectionEnabled;
}

#if RNS_TABS_UITAB_API_SDK_AVAILABLE

/// TODO(step-4): consumed by the shared selection-policy method once P2 settles callback routing.
- (BOOL)shouldPreventNativeTabSelection:(nonnull UITab *)nextTab API_AVAILABLE(ios(18.0))
{
  UIViewController *nextViewController = nextTab.viewController;

  if (nextViewController == nil) {
    RCTLogWarn(@"[RNScreens] Unexpected case. Tab should always be associated with a view controller");
    return NO;
  }

  return [self shouldPreventNativeViewControllerSelection:nextViewController];
}

#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE

#pragma mark - UITabBarControllerDelegate

// These methods are not called on programatic selection!
// They are called only when a user taps on tab bar.

#if RNS_TABS_UITAB_API_SDK_AVAILABLE

/// Counterpart of `tabBarController:shouldSelectViewController:` on the UITab path.
/// Routes into the very same policy - deliberately NOT by forwarding to the legacy delegate method,
/// which would run the policy twice.
- (BOOL)tabBarController:(UITabBarController *)tabBarController shouldSelectTab:(UITab *)tab API_AVAILABLE(ios(18.0))
{
  RCTAssert(tabBarController == self, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);
  NSLog(@"[RNS-PROBE] delegate shouldSelectTab: id=%@ vc=%@ currentSelectedTab=%@",
        tab.identifier,
        NSStringFromClass(tab.viewController.class),
        self.selectedTab.identifier);

  UIViewController *nextViewController = tab.viewController;
  if (nextViewController == nil) {
    RCTLogWarn(@"[RNScreens] Tab %@ resolved to no view controller", tab.identifier);
    return YES;
  }

  BOOL shouldSelect = [self shouldAllowUserSelectionOfViewController:nextViewController];

  // Remember that the upcoming `didSelectTab:previousTab:` belongs to a user-driven selection that
  // we admitted, as opposed to the one UIKit fires while installing children.
  _isHandlingUserTabSelection = shouldSelect;

  return shouldSelect;
}

/// Counterpart of `tabBarController:didSelectViewController:` on the UITab path.
- (void)tabBarController:(UITabBarController *)tabBarController
            didSelectTab:(UITab *)selectedTab
             previousTab:(UITab *)previousTab API_AVAILABLE(ios(18.0))
{
  RCTAssert(tabBarController == self, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);
  NSLog(@"[RNS-PROBE] delegate didSelectTab: id=%@ previous=%@ userDriven=%d",
        selectedTab.identifier,
        previousTab.identifier,
        _isHandlingUserTabSelection);

  // UIKit also calls this from within `setTabs:animated:`. The legacy path has no such callback on
  // `setViewControllers:animated:`, and progressing state there would emit a spurious selection.
  if (!_isHandlingUserTabSelection) {
    return;
  }
  _isHandlingUserTabSelection = NO;

  UIViewController *selectedController = selectedTab.viewController;
  RCTAssert(selectedController != nil,
            @"[RNScreens] Selected tab %@ MUST resolve to a view controller",
            selectedTab.identifier);
  if (selectedController == nil) {
    _isHandlingExplicitSelectionUpdate = NO;
    return;
  }

  [self userDidSelectViewController:selectedController];
  _isHandlingExplicitSelectionUpdate = NO;
}

#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE

/**
 * Shared user-selection policy for both configuration paths.
 *
 * MUST be invoked exactly once per selection attempt: it both decides the outcome AND performs the
 * repeat / prevention side effects. Never call it from another delegate method that already ran it.
 *
 * @returns whether UIKit should proceed with selecting `viewController`.
 */
- (BOOL)shouldAllowUserSelectionOfViewController:(nonnull UIViewController *)viewController
{
  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class] ||
                [viewController isKindOfClass:UINavigationController.class],
            @"[RNScreens] Unexpected type of controller: %@",
            viewController.class);

  // TODO: handle enforcing orientation with natively-driven tabs

  // Detect repeated selection and inform tabScreenController
  BOOL repeatedSelection = [self selectedScreenController] == viewController;

  if (repeatedSelection) {
    // On repeated selection we return false to prevent native *pop to root* effect that works only starting from iOS 26
    // and interferes with our implementation (which is necessary for controlled tabs).

    // We trigger the state update from here, because `tabBarController:didSelectViewController:` won't be called.
    [self userDidRepeatViewControllerSelection:viewController];

    return NO;
  }

  BOOL shouldPreventTabSelection = [self shouldPreventNativeViewControllerSelection:viewController];

  if (shouldPreventTabSelection) {
    // Ideally we'd call this AFTER we prevent, but there is no appropriate callback.
    // As long as we emit the event asynchronously this is rather fine.
    [self onDidPreventUserFromSelectingViewControllerWithKey:[self screenKeyForViewController:viewController]];
    return NO;
  }

  // If we're gonna allow navigation to `moreNavigationController`, then we need to ensure
  // that on top of its stack there is no controller with preventNativeSelection enabled.
  // In such case, we want to pop to root.
  // We do it here, because in `tabBarController:didSelectViewController:` we won't receive
  // `moreNavigationController` in case there is already a tab pushed on the stack.
  if ([self isViewControllerTheMoreNavigationController:viewController]) {
    auto *poppedViewController = [self popToRootInMoreNavigationControllerRespectSelectionPrevention:YES animated:NO];
    if (poppedViewController != nil) {
      // We actually popped something -> let's notify JS realm of this fact.
      [self onDidPreventUserFromSelectingViewControllerWithKey:[self screenKeyForViewController:poppedViewController]];
    }
  }

  _isHandlingExplicitSelectionUpdate = YES;
  return YES;
}

- (BOOL)tabBarController:(UITabBarController *)tabBarController
    shouldSelectViewController:(UIViewController *)viewController
{
  RCTAssert(tabBarController == self, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);
  NSLog(@"[RNS-PROBE] delegate shouldSelectViewController: %@", NSStringFromClass(viewController.class));

  return [self shouldAllowUserSelectionOfViewController:viewController];
}

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
  RCTAssert(self == tabBarController, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);
  NSLog(@"[RNS-PROBE] delegate didSelectViewController: %@", NSStringFromClass(viewController.class));

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class] ||
                [viewController isKindOfClass:UINavigationController.class],
            @"[RNScreens] Unexpected type of controller: %@",
            viewController.class);

  [self userDidSelectViewController:viewController];
  _isHandlingExplicitSelectionUpdate = NO;
}

#pragma mark - UINavigationControllerDelegate

- (void)navigationController:(UINavigationController *)navigationController
      willShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  RCTAssert(self.moreNavigationController == navigationController,
            @"[RNScreens] Unexpected view controller called delegate method: %@",
            navigationController);

  NSLog(@"[RNS-PROBE] moreNav willShowViewController: %@ shouldProgress=%d",
        NSStringFromClass(viewController.class),
        [self shouldProgressStateOnMoreNavigationControllerPush]);

  // The root view controller is of different type.
  if ([viewController isKindOfClass:RNSTabsScreenViewController.class] &&
      [self shouldProgressStateOnMoreNavigationControllerPush]) {
    [self userDidSelectViewController:viewController];
    [self setShouldProgressStateOnMoreNavigationControllerPush:NO];
  } else if ([self usesUITabAPI] && viewController == navigationController.viewControllers.firstObject) {
    // On the legacy path the More tab is reported through `didSelectViewController:` and the event
    // is emitted from `userDidSelectViewController:`. Under `tabs` UIKit reports no selection for
    // More at all - it is not a `UITab` - so the More list becoming visible is our only signal.
    //
    // This is deliberately NOT driven from `tabBar:didSelectItem:`: tapping the More item while an
    // overflow screen is displayed re-shows that screen rather than the list, and must not emit.
    [self disableNavigationBarInMoreNavigationController];
    [_observerRegistry emitDidSelectMoreTabWithCurrentState:_navigationState sender:self];
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

#pragma mark - UIKit configuration boundary

/**
 * Every UIKit read/write related to child installation & selection goes through the methods below.
 *
 * The legacy `viewControllers`-based API and the `UITab`-based API (iOS 18+) are mutually exclusive.
 * Per UIKit's own header: once `tabs` is set, `viewControllers` and related properties and methods
 * will not be called. Funnelling these accesses through a single boundary is what makes supporting
 * both configuration paths tractable.
 */

- (void)installScreenControllers:(nonnull NSArray<RNSTabsScreenViewController *> *)screenControllers
                        animated:(BOOL)animated
{
#if RNS_TABS_UITAB_API_SDK_AVAILABLE
  if (RNS_TABS_UITAB_RUNTIME_AVAILABLE) {
    if ([self usesUITabAPI]) {
      _installedScreenControllers = screenControllers;
      [self setTabs:[self tabsForScreenControllers:screenControllers] animated:animated];

      // On the legacy path the More machinery is installed lazily, from
      // `userDidSelectViewController:` once the More controller becomes selected. Under `tabs`
      // UIKit reports no selection at all for More, so there is no lazy hook to hang it on - the
      // navigation delegate and the push interceptor have to be in place up front, otherwise
      // nothing can observe or gate navigation performed inside the More list.
      if ([self canHaveMoreNavigationController]) {
        [self prepareForMoreNavigationControllerHandlingIfNeeded];
        [self disableNavigationBarInMoreNavigationController];
      }

      [self rns_probeDumpConfiguration:@"installScreenControllers(UITab)"];
      return;
    }
  }
#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE
  _installedScreenControllers = screenControllers;
  [self setViewControllers:screenControllers animated:animated];
  [self rns_probeDumpConfiguration:@"installScreenControllers(legacy)"];
}

/**
 * Controllers currently installed in UIKit.
 *
 * This does NOT include the `moreNavigationController`, matching the documented behaviour
 * of `UITabBarController.viewControllers`.
 */
- (nonnull NSArray<__kindof UIViewController *> *)installedScreenControllers
{
#if RNS_TABS_UITAB_API_SDK_AVAILABLE
  if (RNS_TABS_UITAB_RUNTIME_AVAILABLE) {
    if ([self usesUITabAPI]) {
      return _installedScreenControllers ?: @[];
    }
  }
#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE
  return self.viewControllers ?: @[];
}

/**
 * Currently selected controller, if any. This MAY be the `moreNavigationController`.
 */
- (nullable __kindof UIViewController *)selectedScreenController
{
  // Deliberately the same on BOTH configuration paths.
  //
  // Unlike `viewControllers` - which UIKit empties once `tabs` is set - `selectedViewController`
  // keeps working under the `UITab` path AND remains the only accessor that tracks overflow
  // selection. `selectedTab` does not: selecting a screen through the More list leaves
  // `selectedTab` pointing at the previously selected root tab, because More is not a `UITab`.
  // Resolving through `selectedTab.viewController` here made `userDidSelectViewController:`
  // assert on every More-list selection.
  return self.selectedViewController;
}

- (void)applySelectedScreenController:(nonnull UIViewController *)screenController
{
#if RNS_TABS_UITAB_API_SDK_AVAILABLE
  if (RNS_TABS_UITAB_RUNTIME_AVAILABLE) {
    if ([self usesUITabAPI]) {
      NSString *screenKey = [self screenKeyForViewController:screenController];
      UITab *tab = [self tabForIdentifier:screenKey];
      RCTAssert(tab != nil, @"[RNScreens] No installed UITab for screenKey: %@", screenKey);
      if (tab != nil) {
        // Deliberately goes through our own setter override - see the legacy branch below.
        [self setSelectedTab:tab];
      }
      return;
    }
  }
#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE
  // Deliberately goes through our own setter override, so that reconciliation of implicit
  // UIKit-driven updates keeps working.
  [self setSelectedViewController:screenController];
}

#if RNS_TABS_UITAB_API_SDK_AVAILABLE

/**
 * Builds `UITab` wrappers for given controllers, reusing an already installed wrapper whenever
 * both its identifier and its associated controller still match. A same-key remount therefore
 * binds a fresh wrapper, while metadata updates and reordering reuse the existing one.
 */
- (nonnull NSArray<UITab *> *)tabsForScreenControllers:
    (nonnull NSArray<RNSTabsScreenViewController *> *)screenControllers API_AVAILABLE(ios(18.0))
{
  NSArray<UITab *> *installedTabs = self.tabs;
  NSMutableArray<UITab *> *tabs = [NSMutableArray arrayWithCapacity:screenControllers.count];

  for (RNSTabsScreenViewController *screenController in screenControllers) {
    NSString *screenKey = screenController.getScreenKeyOrNull;
    RCTAssert(![NSString rnscreens_isBlankOrNull:screenKey],
              @"[RNScreens] Tab screen MUST have a non-empty screenKey before it is installed");

    UITab *tab = [self findInstalledTabIn:installedTabs forScreenKey:screenKey controller:screenController];

    if (tab == nil) {
      // `UITab.title` is nonnull. The real title is applied later through the regular metadata
      // update path; an empty string is only the pre-metadata placeholder.
      tab = [[UITab alloc] initWithTitle:screenController.title ?: @""
                                   image:nil
                              identifier:screenKey
                  viewControllerProvider:^UIViewController *(__kindof UITab *_Nonnull requestingTab) {
                    // Returns the existing controller - we never construct controllers or React
                    // content lazily here.
                    return screenController;
                  }];
    }

    [tabs addObject:tab];
  }

  return tabs;
}

- (nullable UITab *)findInstalledTabIn:(nullable NSArray<UITab *> *)installedTabs
                          forScreenKey:(nonnull NSString *)screenKey
                            controller:(nonnull UIViewController *)screenController API_AVAILABLE(ios(18.0))
{
  for (UITab *tab in installedTabs) {
    // Reading `tab.viewController` may invoke the tab's provider. Ours only returns an already
    // existing controller, so this is side-effect free.
    if ([tab.identifier isEqualToString:screenKey] && tab.viewController == screenController) {
      return tab;
    }
  }
  return nil;
}

- (void)setSelectedTab:(UITab *)selectedTab API_AVAILABLE(ios(18.0))
{
  NSLog(@"[RNS-PROBE] setSelectedTab: %@ (explicit=%d)", selectedTab.identifier, _isHandlingExplicitSelectionUpdate);
  [super setSelectedTab:selectedTab];
  if (!_isHandlingExplicitSelectionUpdate) {
    [self reconcileNavigationStateWithUIKitState];
  }
}

#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE

#pragma mark - Probe instrumentation (TEMPORARY - remove before merge)

/// Dumps the UIKit-side configuration so that the legacy and UITab paths can be compared on the
/// same runtime. Answers P1 (what the legacy getters return once `tabs` is set) and feeds P3.
- (void)rns_probeDumpConfiguration:(nonnull NSString *)context
{
  NSMutableString *out = [NSMutableString stringWithFormat:@"[RNS-PROBE] %@\n", context];
  [out appendFormat:@"  usesUITabAPI          = %d\n", [self usesUITabAPI]];
  [out appendFormat:@"  viewControllers.count = %lu\n", (unsigned long)self.viewControllers.count];
  [out appendFormat:@"  tabBar.items.count    = %lu\n", (unsigned long)self.tabBar.items.count];
  [out appendFormat:@"  selectedViewController= %@\n", self.selectedViewController];
  [out appendFormat:@"  _installedScreenCtrls = %lu\n", (unsigned long)(_installedScreenControllers.count)];
#if RNS_TABS_UITAB_API_SDK_AVAILABLE
  if (RNS_TABS_UITAB_RUNTIME_AVAILABLE) {
    [out appendFormat:@"  tabs.count            = %lu\n", (unsigned long)self.tabs.count];
    [out appendFormat:@"  selectedTab           = %@\n", self.selectedTab.identifier];
    for (UITab *tab in self.tabs) {
      [out appendFormat:@"    tab[%@] visible=%d vc=%@\n",
                        tab.identifier,
                        tab.hasVisiblePlacement,
                        NSStringFromClass(tab.viewController.class)];
    }
  }
#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  [out appendFormat:@"  canHaveMore           = %d\n", [self canHaveMoreNavigationController]];
  [out appendFormat:@"  moreNavCtrl.stack     = %lu\n",
                    (unsigned long)self.moreNavigationController.viewControllers.count];
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  NSLog(@"%@", out);
}

#pragma mark - Signals related

- (void)updateChildViewControllersIfNeeded
{
  if (_needsUpdateOfChildViewControllers) {
    [self updateReactChildrenControllers];
  }
}

- (void)updateReactChildrenControllers
{
  RNSLog(@"TabBarCtrl updateReactChildrenControllers");
  _needsUpdateOfChildViewControllers = false;

  if (_tabScreenControllers == nil) {
    RCTLogWarn(@"[RNScreens] Attempt to update react children while the _updatedChildren array is nil!");
    return;
  }

  [self installScreenControllers:_tabScreenControllers animated:[self installedScreenControllers].count != 0];
}

- (void)updateSelectedViewControllerIfNeeded
{
  if (_pendingStateUpdate != nil) {
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
  if (_pendingStateUpdate == nil || [self installedScreenControllers].count == 0) {
    return;
  }

  RNSLog(@"TabBarCtrl updateSelectedViewController");
  [self updateSelectedViewControllerInner];
  _pendingStateUpdate = nil;
}

/**
 * NEVER call this method directly. Call the proper function `updateSelectedViewController`
 *
 * The logic is extracted to an inner method to correctly manage `_pendingStateUpdate` cleanup.
 */
- (void)updateSelectedViewControllerInner
{
  RCTAssert(_pendingStateUpdate != nil, @"[RNScreens] Pending update MUST NOT be nil");

  UIViewController *currSelectedViewController = [self selectedScreenController];

  NSString *_Nonnull nextSelectedViewControllerKey = _pendingStateUpdate.selectedScreenKey;
  UIViewController *nextSelectedViewController = [self findChildViewControllerForKey:nextSelectedViewControllerKey];

  RCTAssert(nextSelectedViewController != nil,
            @"[RNScreens] Failed to determine next selected view controller for key: %@",
            nextSelectedViewControllerKey);

  RCTAssert([nextSelectedViewController isKindOfClass:RNSTabsScreenViewController.class],
            @"[RNScreens] nextSelectedViewController MUST be %@, got: %@",
            RNSTabsScreenViewController.class,
            nextSelectedViewController.class);

  if (self.rejectStaleNavigationStateUpdates && [self isNavigationStateUpdateStale:_pendingStateUpdate]) {
    [_observerRegistry emitRejectedStateUpdate:_pendingStateUpdate
                                  currentState:_navigationState
                                    withReason:RNSTabsNavigationStateRejectionReasonStale
                                        sender:self];
    return;
  }

  if (currSelectedViewController == nextSelectedViewController && _navigationState != nil) {
    // Nothing to do, we don't allow for programmatic repeat selection, unless
    // we're during first render.
    [_observerRegistry emitRejectedStateUpdate:_pendingStateUpdate
                                  currentState:_navigationState
                                    withReason:RNSTabsNavigationStateRejectionReasonRepeated
                                        sender:self];
    return;
  }

  // TODO: This code MUST be moved to some callback.
  // Should this be called only on JS updates?
  auto *screenViewController = static_cast<RNSTabsScreenViewController *>(nextSelectedViewController);
  if (@available(iOS 26.0, *)) {
    // On iOS 26, we need to set user interface style 2 parent views above the tab bar
    // for this prop to take effect.
    self.tabBar.superview.superview.overrideUserInterfaceStyle =
        screenViewController.tabScreenComponentView.userInterfaceStyle;
  } else {
    self.tabBar.overrideUserInterfaceStyle = screenViewController.tabScreenComponentView.userInterfaceStyle;
  }

  RNSLog(@"Change selected view controller to: %@", nextSelectedViewControllerKey);
  BOOL hasStateProgressed = [self updateSelectedViewControllerTo:nextSelectedViewController
                                                         withKey:nextSelectedViewControllerKey
                                                    actionOrigin:_pendingStateUpdate.actionOrigin];

  if (hasStateProgressed && [self isViewControllerHostedByMoreNavigationController:nextSelectedViewController]) {
    [self disableNavigationBarInMoreNavigationController];
  }

  if (hasStateProgressed) {
    RNSTabsNavigationStateUpdateContext *context =
        [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                           isRepeated:NO
                                            hasTriggeredSpecialEffect:NO
                                                         actionOrigin:_pendingStateUpdate.actionOrigin];
    [_observerRegistry emitDidUpdateStateTo:_navigationState withContext:context sender:self];
  }
}

- (void)updateTabBarAppearanceIfNeeded
{
  if (_needsUpdateOfTabBarAppearance) {
    [self updateTabBarAppearance];
  }
}

- (void)updateTabBarAppearance
{
  RNSLog(@"TabBarCtrl updateTabBarAppearance");
  _needsUpdateOfTabBarAppearance = false;

  [_tabBarAppearanceCoordinator updateAppearanceOfTabBar:[self tabBar]
                                   withHostComponentView:self.tabsHostComponentView
                                    tabScreenControllers:_tabScreenControllers
                                             imageLoader:[self.tabsHostComponentView reactImageLoader]];
}

- (void)updateTabBarA11yIfNeeded
{
  for (UIViewController *tabViewController in [self installedScreenControllers]) {
    auto screenView = static_cast<RNSTabsScreenViewController *>(tabViewController).tabScreenComponentView;
    if (!screenView.tabBarItemNeedsA11yUpdate) {
      continue;
    }

    screenView.tabBarItemNeedsA11yUpdate = NO;
    tabViewController.tabBarItem.accessibilityIdentifier = screenView.tabItemTestID;
    tabViewController.tabBarItem.accessibilityLabel = screenView.tabItemAccessibilityLabel;
  }
}

#pragma mark - Utility

- (nullable RNSTabsScreenViewController *)findChildViewControllerForKey:(nullable NSString *)screenKey
{
  if (screenKey == nil) {
    return nil;
  }
  for (UIViewController *viewController in [self installedScreenControllers]) {
    RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class],
              @"[RNScreens] Unexpected type of controller: %@",
              viewController.class);
    auto *screenViewController = static_cast<RNSTabsScreenViewController *>(viewController);
    if ([screenViewController.getScreenKeyOrNull isEqualToString:screenKey]) {
      return screenViewController;
    }
  }
  return nil;
}

- (void)progressNavigationState:(nonnull NSString *)newSelectedScreenKey withOrigin:(RNSTabsActionOrigin)origin
{
  RCTAssert(newSelectedScreenKey != nil, @"[RNScreens] newSelectedScreenKey MUST NOT be nil");

  if (_navigationState == nil) {
    _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey provenance:0];
    return;
  }

  _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey
                                                             provenance:_navigationState.provenance + 1];

  if (origin != RNSTabsActionOriginProgrammaticJs) {
    _lastUINavigationState = [_navigationState cloneState];
  }
}

/**
 * Be sure to call this method IF AND ONLY IF you know that the `self.selectedViewController`
 * is not the `moreNavigationController`.
 */
- (RNSTabsScreenViewController *)selectedScreenViewController
{
  UIViewController *selectedController = [self selectedScreenController];
  RCTAssert([selectedController isKindOfClass:RNSTabsScreenViewController.class],
            @"[RNScreens] Unexpected type of selectedViewController: %@",
            selectedController.class);
  return static_cast<RNSTabsScreenViewController *>(selectedController);
}

- (nonnull NSString *)screenKeyForViewController:(nonnull UIViewController *)viewController
{
  RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class],
            @"[RNScreens] Expected selected view controller to be of class %@, got: %@",
            RNSTabsScreenViewController.class,
            viewController.class);

  auto *screenKey = static_cast<RNSTabsScreenViewController *>(viewController).getScreenKeyOrNull;
  RCTAssert(screenKey != nil, @"[RNScreens] screenKey MUST NOT be nil");
  return screenKey;
}

#if RNS_TABS_UITAB_API_SDK_AVAILABLE

/// Valid only for wrappers WE installed - the identifier is the screenKey by construction.
/// Never call this on a tab that UIKit may have supplied itself.
- (nonnull NSString *)screenKeyForTab:(nonnull UITab *)tab API_AVAILABLE(ios(18.0))
{
  RCTAssert([self findInstalledTabIn:self.tabs forScreenKey:tab.identifier controller:tab.viewController] == tab,
            @"[RNScreens] screenKeyForTab: called on a tab we do not own: %@",
            tab.identifier);
  return tab.identifier;
}

#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE

- (nonnull NSString *)screenKeyForSelectedViewController
{
  return [self screenKeyForViewController:[self selectedScreenController]];
}

/**
 * Detect and fix any mismatch between `_navigationState` and UIKit's actual selected view controller.
 *
 * This is called from the `setSelectedIndex:` / `setSelectedViewController:` overrides when
 * the change was NOT initiated by a known code path (container update, delegate handling).
 * The primary case is UIKit restoring a tab when the More navigation controller disappears
 * during a horizontal size class transition on iPad.
 */
- (void)reconcileNavigationStateWithUIKitState
{
  if (_navigationState == nil) {
    // Before the first container update, _navigationState is nil — there is no established baseline
    // to drift from. The normal initialization path (performContainerUpdate → progressNavigationState:)
    // handles the nil → first state transition. Reconciling here would prematurely initialize state
    // and emit a delegate notification before the controller is fully set up.
    return;
  }

  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    // We don't want to progress the state in case of more navigation controller.
    // If we're reconciling here, it means that it won't be handled correctly.
    // I'm not aware of any flow where this could happen, hence assertion.
    RCTAssert(NO, @"[RNScreens] Unexpected state reconciliation with More Navigation Controller");
    return;
  }

  UIViewController *selectedController = [self selectedScreenController];
  if (![selectedController isKindOfClass:RNSTabsScreenViewController.class]) {
    RCTAssert(NO, @"[RNScreens] Unexpected controller type during state reconciliation: %@", selectedController.class);
    return;
  }

  NSString *selectedScreenKey = [self screenKeyForSelectedViewController];
  if ([_navigationState.selectedScreenKey isEqualToString:selectedScreenKey]) {
    return;
  }

  RNSLog(@"TabBarCtrl reconcileNavigationStateWithUIKitState: %@ -> %@",
         _navigationState.selectedScreenKey,
         selectedScreenKey);
  [self progressNavigationState:selectedScreenKey withOrigin:RNSTabsActionOriginImplicit];

  if ([self isViewControllerHostedByMoreNavigationController:selectedController]) {
    [self disableNavigationBarInMoreNavigationController];
  }

  auto *context = [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                                     isRepeated:NO
                                                      hasTriggeredSpecialEffect:NO
                                                                   actionOrigin:RNSTabsActionOriginImplicit];
  [_observerRegistry emitDidUpdateStateTo:_navigationState withContext:context sender:self];
}

/**
 * This function assumes that the source of the state is NOT user. In current model, user update is never stale.
 */
- (BOOL)isNavigationStateUpdateStale:(nullable RNSTabsNavigationStateUpdateRequest *)stateUpdate
{
  if (stateUpdate == nil) {
    return YES;
  }

  if (_navigationState == nil || _lastUINavigationState == nil) {
    return NO;
  }

  return stateUpdate.baseProvenance < _lastUINavigationState.provenance;
}

#pragma mark-- More Navigation Controller

- (BOOL)canHaveMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  // https://developer.apple.com/documentation/uikit/uitabbarcontroller?language=objc#The-More-navigation-controller
  // The count is documented. Size class check is empirical, to tighten the condition and have less
  // false positives. If we ever find it not correct, we can safely remove it.
  return [self installedScreenControllers].count >= kMinCountOfVCsForMoreVCPresence &&
      self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact;
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (BOOL)isViewControllerHostedByMoreNavigationController:(nonnull UIViewController *)viewController
{
  if (![self canHaveMoreNavigationController] || ![self isMoreNavigationControllerPresentInTabBar]) {
    return NO;
  }

  // Guard: VC must be one we manage (excludes arbitrary external VCs).
  if ([[self installedScreenControllers] indexOfObject:viewController] == NSNotFound) {
    return NO;
  }

  // Ground truth: if our VC's tabBarItem is NOT in the visible tab bar, it is hosted by the
  // More navigation controller. Correct even when users reorder tabs via the More list's Edit UI.
  return ![self.tabBar.items containsObject:viewController.tabBarItem];
}

- (BOOL)isViewControllerTheMoreNavigationController:(nonnull UIViewController *)viewController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return [self canHaveMoreNavigationController] && viewController == self.moreNavigationController;
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (BOOL)isSelectedViewControllerTheMoreNavigationController
{
  return [self isViewControllerTheMoreNavigationController:[self selectedScreenController]];
}

- (BOOL)isMoreNavigationControllerPresentInTabBar
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return [self canHaveMoreNavigationController] &&
      [self.tabBar.items containsObject:self.moreNavigationController.tabBarItem];
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (BOOL)isMoreNavigationControllerTabBarItemSelected
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return [self canHaveMoreNavigationController] && self.tabBar.selectedItem == self.moreNavigationController.tabBarItem;
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (void)disableNavigationBarInMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  if (!self.moreNavigationController.navigationBar.isHidden) {
    [self.moreNavigationController setNavigationBarHidden:YES animated:NO];
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (nullable UIViewController *)popToRootInMoreNavigationControllerRespectSelectionPrevention:
                                   (BOOL)shouldRespectSelectionPrevention
                                                                                    animated:(BOOL)shouldAnimate
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  if ([self isMoreNavigationControllerPresentInTabBar] && self.moreNavigationController.viewControllers.count > 1) {
    // We quietly assume here, that the root view controller is the `UIMoreListViewController`.
    if (shouldRespectSelectionPrevention) {
      UIViewController *topViewController = self.moreNavigationController.topViewController;
      RCTAssert([topViewController isKindOfClass:RNSTabsScreenViewController.class],
                @"[RNScreens] Unexpected type of view controller on moreNavigationControllerStack: %@",
                topViewController.class);
      RNSTabsScreenViewController *screenController = static_cast<RNSTabsScreenViewController *>(topViewController);
      if (screenController.isPreventNativeSelectionEnabled) {
        return [self popToRootMoreNavigationController:self.moreNavigationController animated:shouldAnimate];
      }
    } else {
      return [self popToRootMoreNavigationController:self.moreNavigationController animated:shouldAnimate];
    }
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return nil;
}

/**
 * Pops the top view controller from more navigation controller. We expect at most two controllers on the stack of more
 * navigation controller. If this assumption ever becomes invalid, this method needs to be updated.
 *
 * @returns nil if there was nothing to pop, the topViewController otherwise.
 */
- (nullable UIViewController *)popToRootMoreNavigationController:
                                   (nonnull UINavigationController *)moreNavigationController
                                                        animated:(BOOL)animated
{
  if (moreNavigationController.viewControllers.count < 2) {
    return nil;
  }

  auto *poppedViewControllers = [moreNavigationController popToRootViewControllerAnimated:animated];
  RCTAssert(poppedViewControllers != nil && poppedViewControllers.count == 1,
            @"[RNScreens] Expected exactly one view controller to be popped");
  return [poppedViewControllers firstObject];
}

- (void)prepareForMoreNavigationControllerHandlingIfNeeded
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  // This can be called multiple times in lifetime of `RNSTabBarController`.
  // UIKit reuses the same `UIMoreNavigationController` instance, but resets both
  // the delegate and the isa pointer when the More controller disappears from the
  // tab bar (e.g. user resizing the app on iPad). We re-apply both unconditionally.
  if (self.moreNavigationController.delegate == nil) {
    self.moreNavigationController.delegate = self;
  }
  [self ensurePushInterceptorOnMoreNavigationController];
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

/// Creates a dynamic subclass of the runtime class of `moreNavigationController`
/// (which is the private `UIMoreNavigationController`) and overrides `pushViewController:animated:`
/// with our gating implementation.
///
/// The subclass name is derived from the actual runtime class of `moreNavigationController`
/// (e.g. `RNS_UIMoreNavigationController`), so if another library ISA-swizzles it first or Apple
/// changes the private class, each distinct original class gets its own correct dynamic subclass.
///
/// This method is idempotent — safe to call multiple times regardless of whether UIKit has
/// reset the ISA between calls. When the ISA already carries our `RNS_` prefix, we return
/// early. When UIKit has reset the ISA (e.g. iPad app resize crossing the threshold at which UIKit introduces the More
/// controller (currently >5 tabs)), the dynamic subclass is looked up (or created) and re-applied.
- (void)ensurePushInterceptorOnMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  Class currentClass = object_getClass(self.moreNavigationController);
  const char *currentClassName = class_getName(currentClass);

  // If the ISA already points to our dynamic subclass, the interceptor is in place.
  // Without this guard, repeated calls when UIKit has NOT reset the ISA would stack
  // `RNS_RNS_...` subclasses, causing infinite recursion in rns_pushViewController's
  // objc_msgSendSuper call.
  if (strncmp(currentClassName, "RNS_", 4) == 0) {
    return;
  }

  // Build a unique subclass name per original runtime class: "RNS_<originalClassName>"
  char dynamicSubclassName[256];
  snprintf(dynamicSubclassName, sizeof(dynamicSubclassName), "RNS_%s", currentClassName);

  Class dynamicSubclass = objc_getClass(dynamicSubclassName);

  if (dynamicSubclass == nil) {
    dynamicSubclass = objc_allocateClassPair(currentClass, dynamicSubclassName, 0);
    RCTAssert(dynamicSubclass != nil, @"[RNScreens] Failed to allocate dynamic subclass of %s", currentClassName);

    Method pushMethod = class_getInstanceMethod(currentClass, @selector(pushViewController:animated:));
    class_addMethod(dynamicSubclass,
                    @selector(pushViewController:animated:),
                    (IMP)rns_pushViewController,
                    method_getTypeEncoding(pushMethod));

    objc_registerClassPair(dynamicSubclass);
  }

  object_setClass(self.moreNavigationController, dynamicSubclass);
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

/// Decides whether `moreNavigationController` should be allowed to push `viewController`.
/// This mirrors the logic in `shouldPreventNativeTabSelection:` for the More list context.
- (BOOL)moreNavigationController:(UINavigationController *)navigationController
        shouldPushViewController:(UIViewController *)viewController
{
  BOOL shouldPrevent = [self shouldPreventNativeViewControllerSelection:viewController];

  if (shouldPrevent) {
    [self onDidPreventUserFromSelectingViewControllerWithKey:[self screenKeyForViewController:viewController]];
    [self deselectMoreListSelectionInNavigationController:navigationController];
  }

  return !shouldPrevent;
}

/// When we prevent a push from the More list, the tapped table view cell stays highlighted
/// because UIKit expects the push to handle deselection on return. We deselect it manually.
- (void)deselectMoreListSelectionInNavigationController:(UINavigationController *)navigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  UIViewController *topVC = navigationController.topViewController;
  UITableView *tableView = [self findTableViewInView:topVC.view];

  if (tableView != nil) {
    NSIndexPath *selectedIndexPath = tableView.indexPathForSelectedRow;
    if (selectedIndexPath != nil) {
      [tableView deselectRowAtIndexPath:selectedIndexPath animated:YES];
    }
  } else {
    RCTLogWarn(@"[RNScreens] Failed to find a table view to clear focus!");
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

/**
 * Unbounded DFS looking for ANY `UITableView` in the subtree rooted at view.
 * The `view` parameter is included in the search.
 */
- (nullable UITableView *)findTableViewInView:(UIView *)view
{
  if ([view isKindOfClass:UITableView.class]) {
    return (UITableView *)view;
  }
  for (UIView *subview in view.subviews) {
    UITableView *result = [self findTableViewInView:subview];
    if (result != nil) {
      return result;
    }
  }
  return nil;
}

/**
 * This method allows getting the `moreNavigationController` instance under a couple of conditions.
 *
 * First, it verifies whether we are on an appropriate platform, where the `moreNavigationController`
 * is available.
 * Second, it verifies whether the `moreNavigationController` can even be in the interface right now.
 */
- (nullable UINavigationController *)resolveMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  if ([self canHaveMoreNavigationController]) {
    return self.moreNavigationController;
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return nil;
}

- (void)updateOrientationIfNeeded
{
  if (_needsOrientationUpdate) {
    [self updateOrientation];
  }
}

- (void)updateOrientation
{
  _needsOrientationUpdate = false;
  [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
}

- (void)updateLayoutDirectionBelowIOS17IfNeeded
{
  if (_needsLayoutDirectionUpdateBelowIOS17) {
    [self updateLayoutDirectionBelowIOS17];
  }
}

- (void)updateLayoutDirectionBelowIOS17
{
  _needsLayoutDirectionUpdateBelowIOS17 = false;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)
  if (@available(iOS 17.0, *)) {
    return;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0)

  RCTAssert(self.parentViewController != nil,
            @"[RNScreens] Expected non-null parent view controller for layout direction update.");
  [self.parentViewController
      setOverrideTraitCollection:[UITraitCollection
                                     traitCollectionWithLayoutDirection:self.tabsHostComponentView.layoutDirection]
          forChildViewController:self];
}

#pragma mark - RNSOrientationProviding

#if !TARGET_OS_TV

- (RNSOrientation)evaluateOrientation
{
  UIViewController *selectedController = [self selectedScreenController];
  if ([selectedController respondsToSelector:@selector(evaluateOrientation)]) {
    id<RNSOrientationProviding> selected = static_cast<id<RNSOrientationProviding>>(selectedController);
    return [selected evaluateOrientation];
  }

  return RNSOrientationInherit;
}

#endif // !TARGET_OS_TV

#pragma mark - Availbility

/**
 * Single policy point deciding which configuration path this controller drives.
 *
 * NOTE: Clang's availability analysis does NOT follow this method's return value. Every use of a
 * `UITab` symbol still needs its own `RNS_TABS_UITAB_RUNTIME_AVAILABLE` guard and, where the
 * symbol may be missing from the build SDK, an `RNS_TABS_UITAB_API_SDK_AVAILABLE` guard.
 */
- (BOOL)usesUITabAPI
{
#if RNS_TABS_UITAB_API_SDK_AVAILABLE
  // TEMPORARY (probe): lets us baseline the legacy path on the very same runtime, so that OS
  // differences cannot masquerade as migration differences. Remove together with the probe.
  if ([NSProcessInfo.processInfo.environment[@"RNS_TABS_FORCE_LEGACY"] isEqualToString:@"1"]) {
    return NO;
  }

  if (RNS_TABS_UITAB_RUNTIME_AVAILABLE) {
    return YES;
  }
#endif // RNS_TABS_UITAB_API_SDK_AVAILABLE
  return NO;
}

@end
