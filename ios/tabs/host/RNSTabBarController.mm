#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import <objc/message.h>
#import <objc/runtime.h>
#import "NSString+RNSUtility.h"
#import "RNSLog.h"
#import "RNSScreenWindowTraits.h"

#define RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE !TARGET_OS_TV && !TARGET_OS_VISION

/**
 * This must be kept in sync with the constant we define in JS - `SCREEN_KEY_MORE_NAV_CTRL`.
 */
static NSString *const kMoreNavigationControllerScreenKey = @"rnscreens_moreNavigationController";

// We need UINavigationControllerDelegate to handle navigation within `moreNavigationController`
@interface RNSTabBarController () <UITabBarControllerDelegate, UINavigationControllerDelegate>
@end

@interface RNSTabBarController ()

/// Consulted by the ISA-swizzled `pushViewController:animated:` on `moreNavigationController`
/// to decide whether a push should proceed.
- (BOOL)moreNavigationController:(UINavigationController *)navigationController
        shouldPushViewController:(UIViewController *)viewController;

@end

#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
/**
 * Key used to store a weak (ASSIGN) reference back to the owning RNSTabBarController
 * as an associated object on the moreNavigationController instance.
 */
static const void *kRNSTabBarControllerAssociationKey = &kRNSTabBarControllerAssociationKey;

/**
 * Replacement implementation for `pushViewController:animated:` injected into
 * a dynamic subclass of `UIMoreNavigationController` via ISA-swizzle.
 *
 * Before allowing the push, this function consults the owning `RNSTabBarController`
 * to check whether the push should be prevented (e.g. due to `preventNativeSelection`).
 */
static void
rns_pushViewController(__unsafe_unretained id self, SEL _cmd, UIViewController *viewController, BOOL animated)
{
  NSLog(@"MoreNavigationController pushViewController");
  RNSTabBarController *tabBarController = objc_getAssociatedObject(self, kRNSTabBarControllerAssociationKey);

  if ([tabBarController moreNavigationController:self shouldPushViewController:viewController]) {
    struct objc_super superInfo = {
        .receiver = self,
        .super_class = class_getSuperclass(object_getClass(self)),
    };
    ((void (*)(struct objc_super *, SEL, UIViewController *, BOOL))objc_msgSendSuper)(
        &superInfo, _cmd, viewController, animated);
  }
}
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _tabScreenControllers;

  /// This property is nullable until first container update. Later it MUST NOT be nil.
  RNSTabsNavigationState *_Nullable _navigationState;

  /// Holds last state that has been a result of UI-side navigation (user request).
  ///
  /// This property is nullable until first container update. Later it MUST NOT be nil.
  RNSTabsNavigationState *_Nullable _lastUINavigationState;

  RNSTabsNavigationState *_Nullable _pendingOperation;

#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  BOOL _didAccessMoreNavigationController;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE

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
    _pendingOperation = nil;

    // Delegate field retains weakly, no risk of cycle.
    self.delegate = self;

#if !RCT_NEW_ARCH_ENABLED
    _isControllerFlushBlockScheduled = NO;
#endif // !RCT_NEW_ARCH_ENABLED
  }
  return self;
}

- (instancetype)initWithTabsHostComponentView:(nullable RNSTabsHostComponentView *)tabsHostComponentView
{
  if (self = [self init]) {
    _tabsHostComponentView = tabsHostComponentView;
  }
  return self;
}

- (void)dealloc
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  // Clear the OBJC_ASSOCIATION_ASSIGN back-reference to self stored on moreNavigationController.
  // This is a safety measure — moreNavigationController should never outlive us, but if it ever does
  // (e.g. due to UIKit lifecycle changes), we avoid leaving a dangling pointer behind.
  //
  // We guard with _didAccessMoreNavigationController to avoid lazy creation of
  // moreNavigationController during teardown. We also check the isa prefix because UIKit may have
  // already reset it (e.g. iPad resize), in which case there's no associated object to clean up.
  if (_didAccessMoreNavigationController) {
    Class currentClass = object_getClass(self.moreNavigationController);
    const char *className = class_getName(currentClass);
    if (strncmp(className, "RNS_", 4) == 0) {
      objc_setAssociatedObject(
          self.moreNavigationController, kRNSTabBarControllerAssociationKey, nil, OBJC_ASSOCIATION_ASSIGN);
    }
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
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

#pragma mark - Signals

- (void)setPendingNavigationStateUpdate:(nullable RNSTabsNavigationState *)navState
{
  _pendingOperation = navState;
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
  [self updateChildViewControllersIfNeeded];
  [self updateSelectedViewControllerIfNeeded];
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
{
  if (nextSelectedViewController == nil) {
    return NO;
  }

  UIViewController *currSelectedViewController = self.selectedViewController;

  RCTAssert(
      ![NSString rnscreens_isBlankOrNull:screenKey],
      @"[RNScreens] The screenKey MUST NOT be null if the view controller is not null");

  [self progressNavigationState:screenKey withSource:RNSTabsNavigationStateUpdateSourceExternal];

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
  [self progressNavigationState:[self screenKeyForSelectedViewController]
                     withSource:RNSTabsNavigationStateUpdateSourceUser];
}

- (void)userDidRepeatViewControllerSelection:(nonnull UIViewController *)viewController
{
  RCTAssert(
      self.selectedViewController == viewController, @"[RNScreens] Expected UIKit to update selectedViewController");

  [self updateNavigationStateOnModelUpdate];

  // After state progression we trigger the special effect.
  BOOL repeatedSelectionHandledBySpecialEffect = NO;

  if (![self isSelectedViewControllerTheMoreNavigationController]) {
    // Do not perform special effects on `moreNavigationController`.
    repeatedSelectionHandledBySpecialEffect = [[self selectedScreenViewController] tabScreenSelectedRepeatedly];
  }

  auto *updateContext =
      [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                         isRepeated:YES
                                          hasTriggeredSpecialEffect:repeatedSelectionHandledBySpecialEffect
                                                     isNativeAction:YES];
  [self.tabsHostComponentView tabBarController:self didUpdateStateTo:_navigationState withContext:updateContext];
}

- (void)userDidSelectViewController:(nonnull UIViewController *)viewController
{
  // At this moment the `UITabBarController` model is already updated.
  RCTAssert(
      self.selectedViewController == viewController, @"[RNScreens] Expected UIKit to update selectedViewController");

  [self updateNavigationStateOnModelUpdate];

  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    [self disableNavigationBarInMoreNavigationController];
    [self prepareForMoreNavigationControllerHandlingIfNeeded];
  }

  auto *updateContext = [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                                           isRepeated:NO
                                                            hasTriggeredSpecialEffect:NO
                                                                       isNativeAction:YES];
  [self.tabsHostComponentView tabBarController:self didUpdateStateTo:_navigationState withContext:updateContext];
}

- (void)onDidPreventUserFromSelectingViewControllerWithKey:(nonnull NSString *)screenKey
{
  [self.tabsHostComponentView tabBarController:self preventedSelectionOf:screenKey currentState:_navigationState];
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
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class] ||
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

  // This handles the tabsHostComponentView nullability
  // TODO: This if is likely to be removed, since we want to roll back the support
  // for "controlled mode", at least initially.
  if ([self.tabsHostComponentView experimental_controlNavigationStateInJS]) {
    return NO;
  }

  BOOL shouldPreventTabSelection = [self shouldPreventNativeTabSelection:viewController];

  if (shouldPreventTabSelection) {
    // Ideally we'd call this AFTER we prevent, but there is no appropriate callback.
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

  return YES;
}

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
  RCTAssert(self == tabBarController, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);

  BOOL isNextViewControllerMoreNavigationController = [viewController isKindOfClass:UINavigationController.class];

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class] || isNextViewControllerMoreNavigationController,
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);

  [self userDidSelectViewController:viewController];
}

#pragma mark - UINavigationControllerDelegate

- (void)navigationController:(UINavigationController *)navigationController
       didShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  RCTAssert(
      self.moreNavigationController == navigationController,
      @"[RNScreens] Unexpected view controller called delegate method: %@",
      navigationController);

  // The root view controller is of different type.
  if ([viewController isKindOfClass:RNSTabsScreenViewController.class]) {
    [self userDidSelectViewController:viewController];
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
  if (_pendingOperation != nil) {
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
  if (_pendingOperation == nil || self.viewControllers.count == 0) {
    return;
  }

  RNSLog(@"TabBarCtrl updateSelectedViewController");
  [self updateSelectedViewControllerInner];
  _pendingOperation = nil;
}

/**
 * NEVER call this method directly. Call the proper function `updateSelectedViewController`
 *
 * The logic is extracted to an inner method to correctly manage _pendingOperation cleanup.
 */
- (void)updateSelectedViewControllerInner
{
  UIViewController *_Nonnull currSelectedViewController = self.selectedViewController;

  NSString *_Nonnull nextSelectedViewControllerKey = _pendingOperation.selectedScreenKey;
  UIViewController *nextSelectedViewController = nil;
  BOOL isNextMoreNavigationController = NO;

  if ([self isMoreNavigationControllerRequestedByOperation:_pendingOperation]) {
    if (![self isMoreNavigationControllerPresentInTabBar]) {
      // If the controller is not visible atm. we'll crash the app if we try to navigate to it.
      RCTAssert(
          _navigationState != nil,
          @"[RNScreens] MoreNavigationController MUST NOT be used as an initially selected tab");
      [self.tabsHostComponentView tabBarController:self
                             rejectedStateUpdateTo:_pendingOperation
                                      currentState:_navigationState
                                        withReason:RNSTabsNavigationStateRejectionReasonMoreNavCtrlNotAvailable];
      return;
    }
    nextSelectedViewController = [self resolveMoreNavigationController];
    RCTAssert(nextSelectedViewController != nil, @"[RNScreens] Expected non-nil moreNavigationController");
    isNextMoreNavigationController = YES;
  } else {
    nextSelectedViewController = [self findChildViewControllerForKey:nextSelectedViewControllerKey];
  }

  RCTAssert(
      nextSelectedViewController != nil,
      @"[RNScreens] Failed to determine next selected view controller for key: %@",
      nextSelectedViewControllerKey);

  RCTAssert(
      isNextMoreNavigationController || [nextSelectedViewController isKindOfClass:RNSTabsScreenViewController.class],
      @"[RNScreens] nextSelectedViewController MUST be either UINavigationController or %@, got: %@",
      RNSTabsScreenViewController.class,
      nextSelectedViewController.class);

  if (self.rejectStaleNavigationStateUpdates && [self isNavigationStateUpdateStale:_pendingOperation]) {
    [self.tabsHostComponentView tabBarController:self
                           rejectedStateUpdateTo:_pendingOperation
                                    currentState:_navigationState
                                      withReason:RNSTabsNavigationStateRejectionReasonStale];
    return;
  }

  if (currSelectedViewController == nextSelectedViewController && _navigationState != nil) {
    // Nothing to do, we don't allow for programmatic repeat selection, unless
    // we're during first render.
    [self.tabsHostComponentView tabBarController:self
                           rejectedStateUpdateTo:_pendingOperation
                                    currentState:_navigationState
                                      withReason:RNSTabsNavigationStateRejectionReasonRepeated];
    return;
  }

  // TODO: This code MUST be moved to some callback.
  // Should this be called only on JS updates?
  if (!isNextMoreNavigationController) {
    auto *screenViewController = static_cast<RNSTabsScreenViewController *>(nextSelectedViewController);
    if (@available(iOS 26.0, *)) {
      // On iOS 26, we need to set user interface style 2 parent views above the tab bar
      // for this prop to take effect.
      self.tabBar.superview.superview.overrideUserInterfaceStyle =
          screenViewController.tabScreenComponentView.userInterfaceStyle;
    } else {
      self.tabBar.overrideUserInterfaceStyle = screenViewController.tabScreenComponentView.userInterfaceStyle;
    }
  }

  if (isNextMoreNavigationController) {
    // If we navigate explicitly to `moreNavigationController` we want to show the
    // list of the available view controllers, not what's already on the stack there.

    // Animate only if we're currently in context of more view controller.
    BOOL shouldAnimate = [self isMoreNavigationControllerTabBarItemSelected];
    [self popToRootInMoreNavigationControllerRespectSelectionPrevention:NO animated:shouldAnimate];

    // Also disable the header - we don't control it, but it impacts the layout
    // in ways Yoga is not aware of. The simplest option here is to disable it.
    [self disableNavigationBarInMoreNavigationController];

    [self prepareForMoreNavigationControllerHandlingIfNeeded];
  }

  RNSLog(@"Change selected view controller to: %@", nextSelectedViewControllerKey);
  BOOL hasStateProgressed = [self updateSelectedViewControllerTo:nextSelectedViewController
                                                         withKey:nextSelectedViewControllerKey];

  if (hasStateProgressed) {
    RNSTabsNavigationStateUpdateContext *context =
        [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                           isRepeated:NO
                                            hasTriggeredSpecialEffect:NO
                                                       isNativeAction:NO];
    [self.tabsHostComponentView tabBarController:self didUpdateStateTo:_navigationState withContext:context];
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
    RCTAssert(
        [viewController isKindOfClass:RNSTabsScreenViewController.class],
        @"[RNScreens] Unexpected type of controller: %@",
        viewController.class);
    auto *screenViewController = static_cast<RNSTabsScreenViewController *>(viewController);
    if ([screenViewController.getScreenKeyOrNull isEqualToString:screenKey]) {
      return screenViewController;
    }
  }
  return nil;
}

- (void)progressNavigationState:(nonnull NSString *)newSelectedScreenKey
                     withSource:(RNSTabsNavigationStateUpdateSource)updateSource
{
  RCTAssert(newSelectedScreenKey != nil, @"[RNScreens] newSelectedScreenKey MUST NOT be nil");

  if (_navigationState == nil) {
    _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey provenance:0];
    return;
  }

  _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey
                                                             provenance:_navigationState.provenance + 1];

  if (updateSource == RNSTabsNavigationStateUpdateSourceUser) {
    _lastUINavigationState = [_navigationState cloneState];
  }
}

/**
 * Be sure to call this method IF AND ONLY IF you know that the `self.selectedViewController`
 * is not the `moreNavigationController`.
 */
- (RNSTabsScreenViewController *)selectedScreenViewController
{
  RCTAssert(
      [self.selectedViewController isKindOfClass:RNSTabsScreenViewController.class],
      @"[RNScreens] Unexpected type of selectedViewController: %@",
      self.selectedViewController.class);
  return static_cast<RNSTabsScreenViewController *>(self.selectedViewController);
}

- (nonnull NSString *)screenKeyForViewController:(nonnull UIViewController *)viewController
{
  if ([self isViewControllerTheMoreNavigationController:viewController]) {
    return kMoreNavigationControllerScreenKey;
  }

  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class],
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
 * This function assumes that the source of the state is NOT user. In current model, user update is never stale.
 */
- (BOOL)isNavigationStateUpdateStale:(nullable RNSTabsNavigationState *)newState
{
  if (newState == nil) {
    return YES;
  }

  if (_navigationState == nil || _lastUINavigationState == nil) {
    return NO;
  }

  return newState.provenance < _lastUINavigationState.provenance;
}

#pragma mark-- More Navigation Controller

- (BOOL)canHaveMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  // https://developer.apple.com/documentation/uikit/uitabbarcontroller?language=objc#The-More-navigation-controller
  return self.viewControllers.count > 5;
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (BOOL)isMoreNavigationControllerScreenKey:(nullable NSString *)screenKey
{
  if (screenKey == nil) {
    return NO;
  }
  return [screenKey isEqualToString:kMoreNavigationControllerScreenKey];
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

- (BOOL)isMoreNavigationControllerRequestedByOperation:(nullable RNSTabsNavigationState *)navState
{
  if (navState == nil) {
    return NO;
  }

  return [self isMoreNavigationControllerScreenKey:navState.selectedScreenKey];
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
      RCTAssert(
          [topViewController isKindOfClass:RNSTabsScreenViewController.class],
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
  RCTAssert(
      poppedViewControllers != nil && poppedViewControllers.count == 1,
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
/// This method is idempotent — safe to call multiple times. The dynamic subclass is created once
/// and reused; `object_setClass` and `objc_setAssociatedObject` are re-applied on each call.
/// This is necessary because UIKit resets the isa pointer of `moreNavigationController` during
/// tab bar reconfiguration (e.g. iPad app resize crossing the >5 tab threshold).
- (void)ensurePushInterceptorOnMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  Class originalClass = object_getClass(self.moreNavigationController);
  const char *originalClassName = class_getName(originalClass);

  // Build a unique subclass name per original runtime class: "RNS_<originalClassName>"
  char dynamicSubclassName[256];
  snprintf(dynamicSubclassName, sizeof(dynamicSubclassName), "RNS_%s", originalClassName);

  Class dynamicSubclass = objc_getClass(dynamicSubclassName);

  if (dynamicSubclass == nil) {
    dynamicSubclass = objc_allocateClassPair(originalClass, dynamicSubclassName, 0);
    RCTAssert(dynamicSubclass != nil, @"[RNScreens] Failed to allocate dynamic subclass of %s", originalClassName);

    Method pushMethod = class_getInstanceMethod(originalClass, @selector(pushViewController:animated:));
    class_addMethod(
        dynamicSubclass,
        @selector(pushViewController:animated:),
        (IMP)rns_pushViewController,
        method_getTypeEncoding(pushMethod));

    objc_registerClassPair(dynamicSubclass);
  }

  object_setClass(self.moreNavigationController, dynamicSubclass);

  // Store a back-reference so the C function can reach this controller.
  // OBJC_ASSOCIATION_ASSIGN: no retain cycle — self owns moreNavigationController and outlives it.
  objc_setAssociatedObject(
      self.moreNavigationController, kRNSTabBarControllerAssociationKey, self, OBJC_ASSOCIATION_ASSIGN);
  _didAccessMoreNavigationController = YES;
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
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

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

  RCTAssert(
      self.parentViewController != nil,
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
