#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>
#import "RNSLog.h"
#import "RNSScreenWindowTraits.h"

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _tabScreenControllers;

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

#if !RCT_NEW_ARCH_ENABLED
    _isControllerFlushBlockScheduled = NO;
#endif // !RCT_NEW_ARCH_ENABLED
  }
  return self;
}

- (instancetype)initWithTabsHostComponentView:(nullable RNSBottomTabsHostComponentView *)tabsHostComponentView
{
  if (self = [self init]) {
    _tabsHostComponentView = tabsHostComponentView;
  }
  return self;
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
  RNSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
}

#pragma mark-- Signals

- (void)childViewControllersHaveChangedTo:(NSArray<RNSTabsScreenViewController *> *)reactChildControllers
{
  _tabScreenControllers = reactChildControllers;
  self.needsUpdateOfReactChildrenControllers = true;
}

- (void)setNeedsUpdateOfReactChildrenControllers:(bool)needsReactChildrenUpdate
{
  _needsUpdateOfReactChildrenControllers = true;
  self.needsUpdateOfSelectedTab = true;
#if !RCT_NEW_ARCH_ENABLED
  [self scheduleControllerUpdateIfNeeded];
#endif // !RCT_NEW_ARCH_ENABLED
}

- (void)setNeedsUpdateOfSelectedTab:(bool)needsSelectedTabUpdate
{
  _needsUpdateOfSelectedTab = needsSelectedTabUpdate;

  if (needsSelectedTabUpdate) {
    _needsOrientationUpdate = true;
  }
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

#pragma mark-- RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount
{
  RNSLog(@"TabBarCtrl mountintTransactionWillMount");
}

- (void)reactMountingTransactionDidMount
{
  RNSLog(@"TabBarCtrl mountintTransactionDidMount running updates");
  [self updateReactChildrenControllersIfNeeded];
  [self updateSelectedViewControllerIfNeeded];
  [self updateTabBarAppearanceIfNeeded];
  [self updateOrientationIfNeeded];
}

#pragma mark-- Signals related

- (void)updateReactChildrenControllersIfNeeded
{
  if (_needsUpdateOfReactChildrenControllers) {
    [self updateReactChildrenControllers];
  }
}

- (void)updateReactChildrenControllers
{
  RNSLog(@"TabBarCtrl updateReactChildrenControllers");
  _needsUpdateOfReactChildrenControllers = false;

  if (_tabScreenControllers == nil) {
    RCTLogWarn(@"[RNScreens] Attempt to update react children while the _updatedChildren array is nil!");
    return;
  }

  [self setViewControllers:_tabScreenControllers animated:[[self viewControllers] count] != 0];
}

- (void)updateSelectedViewControllerIfNeeded
{
  if (_needsUpdateOfSelectedTab) {
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
  RNSLog(@"TabBarCtrl updateSelectedViewController");
  _needsUpdateOfSelectedTab = false;

#if !defined(NDEBUG)
  [self assertExactlyOneFocusedTab];
#endif

  RNSTabsScreenViewController *_Nullable selectedViewController = nil;
  for (RNSTabsScreenViewController *tabViewController in self.viewControllers) {
    RNSLog(
        @"Update Selected View Controller [%ld] isFocused %d",
        tabViewController.tabScreenComponentView.tag,
        tabViewController.tabScreenComponentView.isSelectedScreen);
    if (tabViewController.tabScreenComponentView.isSelectedScreen == true) {
      selectedViewController = tabViewController;
      break;
    }
  }

  RCTAssert(selectedViewController != nil, @"[RNScreens] No selected view controller!");

  RNSLog(@"Change selected view controller to: %@", selectedViewController);

  if (@available(iOS 26.0, *)) {
    // On iOS 26, we need to set user interface style 2 parent views above the tab bar
    // for this prop to take effect.
    self.tabBar.superview.superview.overrideUserInterfaceStyle =
        selectedViewController.tabScreenComponentView.userInterfaceStyle;
  } else {
    self.tabBar.overrideUserInterfaceStyle = selectedViewController.tabScreenComponentView.userInterfaceStyle;
  }

  [self setSelectedViewController:selectedViewController];
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

#if !defined(NDEBUG)
- (void)assertExactlyOneFocusedTab
{
  int selectedCount = 0;
  for (RNSTabsScreenViewController *tabViewController in _tabScreenControllers) {
    if (tabViewController.tabScreenComponentView.isSelectedScreen) {
      ++selectedCount;
    }
  }
  RCTAssert(
      selectedCount == 1, @"[RNScreens] Invariant violation. Expected exactly 1 focused tab, got: %d", selectedCount);
}
#endif

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
