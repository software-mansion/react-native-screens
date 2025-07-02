#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _tabScreenControllers;
}

- (instancetype)init
{
  if (self = [super init]) {
    _tabScreenControllers = nil;
    _tabBarAppearanceCoordinator = [RNSTabBarAppearanceCoordinator new];
    _tabsHostComponentView = nil;
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
}

- (void)setNeedsUpdateOfSelectedTab:(bool)needsSelectedTabUpdate
{
  _needsUpdateOfSelectedTab = needsSelectedTabUpdate;
}

- (void)setNeedsUpdateOfTabBarAppearance:(bool)needsUpdateOfTabBarAppearance
{
  _needsUpdateOfTabBarAppearance = needsUpdateOfTabBarAppearance;
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

  [self setViewControllers:_tabScreenControllers animated:true];
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

  UIViewController *_Nullable selectedViewController = nil;
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
                                    tabScreenControllers:_tabScreenControllers];
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

@end
