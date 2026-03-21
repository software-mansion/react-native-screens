#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import "NSString+RNSUtility.h"
#import "RNSLog.h"
#import "RNSScreenWindowTraits.h"

static NSString *const kMoreNavigationControllerScreenKey = @"moreNavigationController";

@interface RNSTabBarController () <UITabBarControllerDelegate>
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
 * This method MUST be called only in situations where `UITabBarControllerMode` has not been updated yet.
 * Otherwise it'll progress the state incorrectly.
 *
 * @returns whether the state has been updated or not.
 */
- (BOOL)updateSelectedViewControllerTo:(nullable UIViewController *)nextSelectedViewController
                               withKey:(nullable NSString *)screenKey;
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

  RNSTabsScreenViewController *screenController = static_cast<RNSTabsScreenViewController *>(viewController);

  // TODO: handle enforcing orientation with natively-driven tabs

  // Detect repeated selection and inform tabScreenController
  BOOL repeatedSelection = self.selectedViewController == screenController;

  if (repeatedSelection) {
    // On repeated selection we return false to prevent native *pop to root* effect that works only starting from iOS 26
    // and interferes with our implementation (which is necessary for controlled tabs).

    // We trigger the state update from here, because `tabBarController:didSelectViewController:` won't be called.
    [self userDidRepeatViewControllerSelection:screenController];

    return NO;
  }

  return ![self shouldPreventNativeTabChange];
}

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
  RCTAssert(self == tabBarController, @"[RNScreens] Unexpected type of controller: %@", tabBarController.class);

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class] ||
          [viewController isKindOfClass:UINavigationController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);

  RNSTabsScreenViewController *screenController = static_cast<RNSTabsScreenViewController *>(viewController);

#if !TARGET_OS_TV
  // When the moreNavigationController is selected, we want to show it
  if ([self isSelectedViewControllerTheMoreNavigationController]) {
    // Hide the navigation bar for the more controller
    // TODO: Why do we actually have this code here? Why do we hide the header?
    [self.moreNavigationController setNavigationBarHidden:YES animated:NO];
  }
#endif // !TARGET_OS_TV

  [self userDidSelectViewController:screenController];
}

- (BOOL)shouldPreventNativeTabChange
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
    if (![self canHaveMoreNavigationController]) {
      // TODO: Emit rejection event
      return;
    }
    nextSelectedViewController = self.moreNavigationController;
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

- (BOOL)canHaveMoreNavigationController
{
#if !TARGET_OS_TV
  // https://developer.apple.com/documentation/uikit/uitabbarcontroller?language=objc#The-More-navigation-controller
  return self.viewControllers.count > 5;
#else
  return NO;
#endif // !TARGET_OS_TV
}

- (BOOL)isSelectedViewControllerTheMoreNavigationController
{
#if !TARGET_OS_TV
  return [self canHaveMoreNavigationController] && self.selectedViewController == self.moreNavigationController;
#else
  return NO;
#endif // !TARGET_OS_TV
}

- (BOOL)isMoreNavigationControllerRequestedByOperation:(nullable RNSTabsNavigationState *)navState
{
  if (navState == nil) {
    return NO;
  }

  return [navState.selectedScreenKey isEqualToString:kMoreNavigationControllerScreenKey];
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
