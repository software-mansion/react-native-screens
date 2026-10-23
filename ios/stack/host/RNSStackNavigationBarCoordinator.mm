#import "RNSStackNavigationBarCoordinator.h"
#import "RNSAssert.h"
#import "RNSStackNavigationBar.h"

@implementation RNSStackNavigationBarCoordinator

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:hidden animated:animated];
}

#if !TARGET_OS_TV
- (void)setBackButtonMenuEnabled:(BOOL)enabled forNavigationController:(UINavigationController *)navigationController
{
  RNSAssert([navigationController.navigationBar isKindOfClass:RNSStackNavigationBar.class],
            @"An instance of RNSStackNavigationBar is expected for navigation bar implementation");
  static_cast<RNSStackNavigationBar *>(navigationController.navigationBar).backButtonMenuEnabled = enabled;
}
#endif // !TARGET_OS_TV

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = YES;
#endif // !TARGET_OS_TV
}

@end
