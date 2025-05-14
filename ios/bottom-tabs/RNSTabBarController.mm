#import "RNSTabBarController.h"
#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@implementation RNSTabBarController {
  NSArray<RNSTabsScreenViewController *> *_Nullable _updatedChildren;
}

- (instancetype)init
{
  if (self = [super init]) {
    _updatedChildren = nil;
  }
  return self;
}

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item
{
  NSLog(@"TabBar: %@ didSelectItem: %@", tabBar, item);
  //  [super tabBar:tabBar didSelectItem:item];
}

- (void)applyTabBarAppearance:(nullable UITabBarAppearance *)appearance
{
  [[self tabBar] setStandardAppearance:appearance];
  [[self tabBar] setScrollEdgeAppearance:appearance];
}

#pragma mark-- Signals

- (void)childViewControllersHaveChangedTo:(NSArray<RNSTabsScreenViewController *> *)reactChildControllers
{
  _updatedChildren = reactChildControllers;
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

#pragma mark-- RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount
{
}

- (void)reactMountingTransactionDidMount
{
  if (_needsUpdateOfReactChildrenControllers) {
    [self updateReactChildrenControllers];
  }

  if (_needsUpdateOfSelectedTab) {
    [self updateSelectedViewController];
  }
}

- (void)updateReactChildrenControllers
{
  _needsUpdateOfReactChildrenControllers = false;

  if (_updatedChildren == nil) {
    RCTLogWarn(@"[RNScreens] Attempt to update react children while the _updatedChildren array is nil!");
    return;
  }

  [self setViewControllers:_updatedChildren];
  _updatedChildren = nil;
}

- (void)updateSelectedViewController
{
  _needsUpdateOfSelectedTab = false;

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

@end
