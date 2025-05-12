#import "RNSTabBarController.h"

@interface RNSTabBarController ()

@end

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

@end
