#import "RNSTabBarController.h"
#import <React/RCTAssert.h>

@implementation RNSTabBarController

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

- (void)updateContainerWithChildViewControllers:(NSArray<RNSTabsScreenViewController *> *)childViewControllers
{
  [self setViewControllers:childViewControllers animated:NO];
}

#pragma mark-- RNSReactTransactionObserving

- (void)reactTransactionWillMount
{
}

- (void)reactTransactionDidMount
{
  if (self.needsContainerUpdateAfterReactTransaction) {
    _needsContainerUpdateAfterReactTransaction = false;
    [self updateSelectedViewController];
  }
}

- (void)updateSelectedViewController
{
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
