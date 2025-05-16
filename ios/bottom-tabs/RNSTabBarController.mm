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
  }
  return self;
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
  NSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
  //  [super tabBar:tabBar didSelectItem:item];
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
}

- (void)reactMountingTransactionDidMount
{
  [self updateReactChildrenControllersIfNeeded];
  [self updateSelectedViewControllerIfNeeded];
  [self updateTabBarAppearanceIfNeeded];
}

- (void)updateReactChildrenControllersIfNeeded
{
  if (_needsUpdateOfReactChildrenControllers) {
    [self updateReactChildrenControllers];
  }
}

- (void)updateReactChildrenControllers
{
  _needsUpdateOfReactChildrenControllers = false;

  if (_tabScreenControllers == nil) {
    RCTLogWarn(@"[RNScreens] Attempt to update react children while the _updatedChildren array is nil!");
    return;
  }

  [self setViewControllers:_tabScreenControllers];
}

- (void)updateSelectedViewControllerIfNeeded
{
  if (_needsUpdateOfSelectedTab) {
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
  _needsUpdateOfSelectedTab = false;

#if !defined(NDEBUG)
  [self assertExactlyOneFocusedTab];
#endif

  UIViewController *_Nullable selectedViewController = nil;
  for (RNSTabsScreenViewController *tabViewController in self.viewControllers) {
    NSLog(
        @"Update Selected View Controller [%ld] isFocused %d",
        tabViewController.tabScreenComponentView.tag,
        tabViewController.tabScreenComponentView.isFocused);
    if (tabViewController.tabScreenComponentView.isFocused == true) {
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
  _needsUpdateOfTabBarAppearance = false;

  UIView *_Nullable maybeHostView = [self.view superview];

  if (![maybeHostView isKindOfClass:RNSBottomTabsHostComponentView.class]) {
    RCTLogWarn(@"[RNScreens] Failed to resolve BottomTabsHostComponentView while updating tab bar appearance");
    maybeHostView = nil;
  }

  auto *hostComponentView = static_cast<RNSBottomTabsHostComponentView *>(maybeHostView);

  [_tabBarAppearanceCoordinator updateAppearanceOfTabBar:[self tabBar]
                                   withHostComponentView:hostComponentView
                                    tabScreenControllers:_tabScreenControllers];
}

#if !defined(NDEBUG)
- (void)assertExactlyOneFocusedTab
{
  int selectedCount = 0;
  for (RNSTabsScreenViewController *tabViewController in _tabScreenControllers) {
    if (tabViewController.tabScreenComponentView.isFocused) {
      ++selectedCount;
    }
  }
  RCTAssert(
      selectedCount == 1, @"[RNScreens] Invariant violation. Expected exactly 1 focused tab, got: %d", selectedCount);
}
#endif

@end
