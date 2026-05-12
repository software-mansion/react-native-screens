#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <objc/message.h>
#import <objc/runtime.h>
#import <limits>
#import "NSString+RNSUtility.h"
#import "RNSLog.h"
#import "RNSScreenWindowTraits.h"
#import "RNSTabsHostComponentView.h"
#import "RNSTabsNavigationStateObserverRegistry.h"

#define RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE !TARGET_OS_TV && !TARGET_OS_VISION

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

  RNSTabsNavigationStateObserverRegistry *_observerRegistry;

#if !RCT_NEW_ARCH_ENABLED
  BOOL _isControllerFlushBlockScheduled;
#endif // !RCT_NEW_ARCH_ENABLED
}

- (instancetype)init
{
  if (self = [super init]) {
    _tabScreenControllers = nil;
    _tabBarAppearanceCoordinator = [RNSTabBarAppearanceCoordinator new];
    _tabsHostComponentView = nil;
    _navigationState = nil;
    _pendingStateUpdate = nil;
    _shouldProgressStateOnMoreNavigationControllerPush = NO;
    _observerRegistry = [RNSTabsNavigationStateObserverRegistry new];

    // Delegate field retains weakly, no risk of cycle.
    self.delegate = self;

#if !RCT_NEW_ARCH_ENABLED
    _isControllerFlushBlockScheduled = NO;
#endif // !RCT_NEW_ARCH_ENABLED
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

#pragma mark - UIKit callbacks

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  [super didMoveToParentViewController:parent];

  if (parent != nil) {
    [self updateLayoutDirectionBelowIOS17IfNeeded];
  }
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
  RNSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
}

- (void)setSelectedIndex:(NSUInteger)selectedIndex
{
  [super setSelectedIndex:selectedIndex];
  if (!_isHandlingExplicitSelectionUpdate) {
    [self reconcileNavigationStateWithUIKitState];
  }
}

- (void)setSelectedViewController:(__kindof UIViewController *)selectedViewController
{
  [super setSelectedViewController:selectedViewController];
  if (!_isHandlingExplicitSelectionUpdate) {
    [self reconcileNavigationStateWithUIKitState];
  }
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];

  if (previousTraitCollection == nil || self.selectedViewController == nil) {
    return;
  }

  if (self.traitCollection.horizontalSizeClass != previousTraitCollection.horizontalSizeClass &&
      [self isViewControllerHostedByMoreNavigationController:self.selectedViewController]) {
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
#if !RCT_NEW_ARCH_ENABLED
  [self scheduleControllerUpdateIfNeeded];
#endif // !RCT_NEW_ARCH_ENABLED
}

- (void)setNeedsUpdateOfTabBarAppearance:(bool)needsUpdateOfTabBarAppearance
{
  _needsUpdateOfTabBarAppearance = needsUpdateOfTabBarAppearance;
#if !RCT_NEW_ARCH_ENABLED
  [self scheduleControllerUpdateIfNeeded];
#endif // !RCT_NEW_ARCH_ENABLED
}

- (void)setNeedsOrientationUpdate:(bool)needsOrientationUpdate
{
  _needsOrientationUpdate = needsOrientationUpdate;
#if !RCT_NEW_ARCH_ENABLED
  [self scheduleControllerUpdateIfNeeded];
#endif // !RCT_NEW_ARCH_ENABLED
}

- (void)setNeedsLayoutDirectionUpdateBelowIOS17:(bool)needsLayoutDirectionUpdate
{
  _needsLayoutDirectionUpdateBelowIOS17 = needsLayoutDirectionUpdate;
}

#pragma mark - RNSReactTransactionObserving

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

  UIViewController *currSelectedViewController = self.selectedViewController;

  RCTAssert(![NSString rnscreens_isBlankOrNull:screenKey],
            @"[RNScreens] The screenKey MUST NOT be null if the view controller is not null");

  [self progressNavigationState:screenKey withOrigin:actionOrigin];

  if (currSelectedViewController == nextSelectedViewController) {
    return YES;
  }

  [self setSelectedViewController:nextSelectedViewController];
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
  RCTAssert(self.selectedViewController == viewController,
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
  RCTAssert(self.selectedViewController == viewController,
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

- (BOOL)shouldPreventNativeTabSelection:(nonnull UIViewController *)nextViewController
{
  if (![nextViewController isKindOfClass:RNSTabsScreenViewController.class]) {
    // Allow for more view controller selection
    return NO;
  }

  auto *screenViewController = static_cast<RNSTabsScreenViewController *>(nextViewController);
  return screenViewController.isPreventNativeSelectionEnabled;
}

#pragma mark - UITabBarControllerDelegate

// These methods are not called on programatic selection!
// They are called only when a user taps on tab bar.

- (BOOL)tabBarController:(UITabBarController *)tabBarController
    shouldSelectViewController:(UIViewController *)viewController
{
  RCTAssert(tabBarController == self, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class] ||
                [viewController isKindOfClass:UINavigationController.class],
            @"[RNScreens] Unexpected type of controller: %@",
            viewController.class);

  // TODO: handle enforcing orientation with natively-driven tabs

  // Detect repeated selection and inform tabScreenController
  BOOL repeatedSelection = self.selectedViewController == viewController;

  if (repeatedSelection) {
    // On repeated selection we return false to prevent native *pop to root* effect that works only starting from iOS 26
    // and interferes with our implementation (which is necessary for controlled tabs).

    // We trigger the state update from here, because `tabBarController:didSelectViewController:` won't be called.
    [self userDidRepeatViewControllerSelection:viewController];

    return NO;
  }

  BOOL shouldPreventTabSelection = [self shouldPreventNativeTabSelection:viewController];

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

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
  RCTAssert(self == tabBarController, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);

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

  // The root view controller is of different type.
  if ([viewController isKindOfClass:RNSTabsScreenViewController.class] &&
      [self shouldProgressStateOnMoreNavigationControllerPush]) {
    [self userDidSelectViewController:viewController];
    [self setShouldProgressStateOnMoreNavigationControllerPush:NO];
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
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

  [self setViewControllers:_tabScreenControllers animated:[[self viewControllers] count] != 0];
}

- (void)updateSelectedViewControllerIfNeeded
{
  if (_pendingStateUpdate != nil) {
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
  if (_pendingStateUpdate == nil || self.viewControllers.count == 0) {
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

  UIViewController *_Nonnull currSelectedViewController = self.selectedViewController;

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
  for (UIViewController *tabViewController in self.viewControllers) {
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
  for (UIViewController *viewController in self.viewControllers) {
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
  RCTAssert([self.selectedViewController isKindOfClass:RNSTabsScreenViewController.class],
            @"[RNScreens] Unexpected type of selectedViewController: %@",
            self.selectedViewController.class);
  return static_cast<RNSTabsScreenViewController *>(self.selectedViewController);
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

- (nonnull NSString *)screenKeyForSelectedViewController
{
  return [self screenKeyForViewController:self.selectedViewController];
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

  if (![self.selectedViewController isKindOfClass:RNSTabsScreenViewController.class]) {
    RCTAssert(NO,
              @"[RNScreens] Unexpected controller type during state reconciliation: %@",
              self.selectedViewController.class);
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

  if ([self isViewControllerHostedByMoreNavigationController:self.selectedViewController]) {
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
  return self.viewControllers.count >= kMinCountOfVCsForMoreVCPresence &&
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
  if ([self.viewControllers indexOfObject:viewController] == NSNotFound) {
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
  return [self isViewControllerTheMoreNavigationController:self.selectedViewController];
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
  BOOL shouldPrevent = [self shouldPreventNativeTabSelection:viewController];

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

#if !RCT_NEW_ARCH_ENABLED

#pragma mark - LEGACY Paper scheduling methods

// TODO: These could be moved to separate scheduler class

- (void)scheduleControllerUpdateIfNeeded
{
  if (_isControllerFlushBlockScheduled) {
    return;
  }

  _isControllerFlushBlockScheduled = YES;

  auto *__weak weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    auto *strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }
    strongSelf->_isControllerFlushBlockScheduled = NO;
    [strongSelf reactMountingTransactionWillMount];
    [strongSelf reactMountingTransactionDidMount];
  });
}

#endif // !RCT_NEW_ARCH_ENABLED

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
  if ([self.selectedViewController respondsToSelector:@selector(evaluateOrientation)]) {
    id<RNSOrientationProviding> selected = static_cast<id<RNSOrientationProviding>>(self.selectedViewController);
    return [selected evaluateOrientation];
  }

  return RNSOrientationInherit;
}

#endif // !TARGET_OS_TV

@end
