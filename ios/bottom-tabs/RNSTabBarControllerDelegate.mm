#import "RNSTabBarControllerDelegate.h"

@implementation RNSTabBarControllerDelegate

- (BOOL)tabBarController:(UITabBarController *)tabBarController
    shouldSelectViewController:(UIViewController *)viewController
{
  return YES;
}

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
}

@end
