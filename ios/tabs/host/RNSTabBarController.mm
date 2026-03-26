#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import "NSString+RNSUtility.h"
#import "RNSLog.h"
#import "RNSScreenWindowTraits.h"

#define RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE !TARGET_OS_TV && !TARGET_OS_VISION

/**
 * This must be kept in sync with the constant we define in JS - `SCREEN_KEY_MORE_NAV_CTRL`.
 */
static NSString *const kMoreNavigationControllerScreenKey = @"rnscreens_moreNavigationController";

@interface RNSTabBarController () <UITabBarControllerDelegate>
@end

// We need this to handle navigation within `moreNavigationController`
@interface RNSTabBarController () <UINavigationControllerDelegate>
@end

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _tabScreenControllers;

  /// This property is nullable until first container udpate. Later it MUST NOT be nil.
  RNSTabsNavigationState *_Nullable _navigationState;
  RNSTabsNavigationState *_Nullable _pendingOperation;

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

  [self progressNavigationState:screenKey];

  if (currSelectedViewController == nextSelectedViewController) {
    [nextSelectedViewController updateTabBarObservedContentScrollViewIfNeeded];
    return YES;
  }

  [self setSelectedViewController:nextSelectedViewController];
  [nextSelectedViewController updateTabBarObservedContentScrollViewIfNeeded];
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
  [self progressNavigationState:[self screenKeyForSelectedViewController]];
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
    [self setupMoreNavigationControllerDelegateIfNeeded];
  }

  auto *updateContext = [[RNSTabsNavigationStateUpdateContext alloc] initWithNavState:_navigationState
                                                                           isRepeated:NO
                                                            hasTriggeredSpecialEffect:NO
                                                                       isNativeAction:YES];
  [self.tabsHostComponentView tabBarController:self didUpdateStateTo:_navigationState withContext:updateContext];
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

  return ![self shouldPreventNativeTabSelection];
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

  if (isNextViewControllerMoreNavigationController) {
    [self disableNavigationBarInMoreNavigationController];
  }

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

- (BOOL)shouldPreventNativeTabSelection
{
  // This handles the tabsHostComponentView nullability
  return [self.tabsHostComponentView experimental_controlNavigationStateInJS] ?: NO;
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

  UIViewController *_Nonnull currSelectedViewController = self.selectedViewController;

  NSString *_Nonnull nextSelectedViewControllerKey = _pendingOperation.selectedScreenKey;
  UIViewController *nextSelectedViewController = nil;
  BOOL isNextMoreNavigationController = NO;

  if ([self isMoreNavigationControllerRequestedByOperation:_pendingOperation]) {
    if (![self isMoreNavigationControllerPresentInTabBar]) {
      // If the controller is not visible atm. we'll crash the app.
      // TODO: Emit rejection event
      _pendingOperation = nil;
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

  if (currSelectedViewController == nextSelectedViewController && _navigationState != nil) {
    // Nothing to do, we don't allow for programmatic repeat selection, unless
    // we're during first render.
    // TODO: Should we emit here that an update has been rejected?
    _pendingOperation = nil;
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
    [self popToRootInMoreNavigationControllerIfNeededAnimated:shouldAnimate];

    // Also disable the header - we don't control it, but it impacts the layout
    // in ways Yoga is not aware of. The simplest option here is to disable it.
    [self disableNavigationBarInMoreNavigationController];

    [self setupMoreNavigationControllerDelegateIfNeeded];
  }

  RNSLog(@"Change selected view controller to: %@", nextSelectedViewControllerKey);
  BOOL hasStateProgressed = [self updateSelectedViewControllerTo:nextSelectedViewController
                                                         withKey:nextSelectedViewControllerKey];
  _pendingOperation = nil;

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
{
  RCTAssert(newSelectedScreenKey != nil, @"[RNScreens] newSelectedScreenKey MUST NOT be nil");

  if (_navigationState == nil) {
    _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey provenance:0];
    return;
  }

  _navigationState = [RNSTabsNavigationState stateWithSelectedScreenKey:newSelectedScreenKey
                                                             provenance:_navigationState.provenance + 1];
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

- (nonnull NSString *)screenKeyForSelectedViewController
{
  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    return kMoreNavigationControllerScreenKey;
  }

  RCTAssert(
      [self.selectedViewController isKindOfClass:RNSTabsScreenViewController.class],
      @"[RNScreens] Expected selected view controller to be of class %@, got: %@",
      RNSTabsScreenViewController.class,
      self.selectedViewController.class);

  auto *screenKey = static_cast<RNSTabsScreenViewController *>(self.selectedViewController).getScreenKeyOrNull;
  RCTAssert(screenKey != nil, @"[RNScreens] screenKey MUST NOT be nil");
  return screenKey;
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

- (BOOL)isSelectedViewControllerTheMoreNavigationController
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  return [self canHaveMoreNavigationController] && self.selectedViewController == self.moreNavigationController;
#else
  return NO;
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
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
  [self.moreNavigationController setNavigationBarHidden:YES animated:NO];
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (void)popToRootInMoreNavigationControllerIfNeededAnimated:(BOOL)isAnimated
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  if ([self isMoreNavigationControllerPresentInTabBar] && self.moreNavigationController.viewControllers.count > 1) {
    // We quietly assume here, that the root view controller is the `UIMoreListViewController`.
    [self.moreNavigationController popToRootViewControllerAnimated:isAnimated];
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
}

- (void)setupMoreNavigationControllerDelegateIfNeeded
{
#if RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
  if (self.moreNavigationController.delegate == nil) {
    self.moreNavigationController.delegate = self;
  }
#endif // RNS_MORE_NAVIGATION_CONTROLLER_AVAILABLE
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
