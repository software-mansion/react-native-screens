#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationBar.h"

@implementation RNSStackNavigationBarCoordinator

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:hidden animated:animated];
}

- (void)setBackButtonMenuEnabled:(BOOL)enabled forNavigationController:(UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  if ([navigationController.navigationBar isKindOfClass:RNSStackNavigationBar.class]) {
    static_cast<RNSStackNavigationBar *>(navigationController.navigationBar).backButtonMenuEnabled = enabled;
  }
#endif // !TARGET_OS_TV
}

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = YES;
#endif // !TARGET_OS_TV
}

@end
