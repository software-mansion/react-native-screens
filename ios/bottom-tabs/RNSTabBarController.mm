#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>

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
  NSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
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

#pragma mark-- RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount
{
  NSLog(@"TabBarCtrl mountintTransactionWillMount");
}

- (void)reactMountingTransactionDidMount
{
  NSLog(@"TabBarCtrl mountintTransactionDidMount running updates");
  [self updateReactChildrenControllersIfNeeded];
  [self updateSelectedViewControllerIfNeeded];
  [self updateTabBarAppearanceIfNeeded];
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
  NSLog(@"TabBarCtrl updateReactChildrenControllers");
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
  NSLog(@"TabBarCtrl updateSelectedViewController");
  _needsUpdateOfSelectedTab = false;

#if !defined(NDEBUG)
  [self assertExactlyOneFocusedTab];
#endif

  RNSTabsScreenViewController *_Nullable selectedViewController = nil;
  for (RNSTabsScreenViewController *tabViewController in self.viewControllers) {
    NSLog(
        @"Update Selected View Controller [%ld] isFocused %d",
        tabViewController.tabScreenComponentView.tag,
        tabViewController.tabScreenComponentView.isSelectedScreen);
    if (tabViewController.tabScreenComponentView.isSelectedScreen == true) {
      selectedViewController = tabViewController;
      break;
    }
  }

  RCTAssert(selectedViewController != nil, @"[RNScreens] No selected view controller!");

  NSLog(@"Change selected view controller to: %@", selectedViewController);

  [selectedViewController.tabScreenComponentView overrideScrollViewBehaviorInFirstDescendantChainIfNeeded];
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
  NSLog(@"TabBarCtrl updateTabBarAppearance");
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

@end
