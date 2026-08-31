#import "RNSStackNavigationBarCoordinator.h"
#import "RNSLog.h"
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
  if ([navigationController.navigationBar isKindOfClass:RNSStackNavigationBar.class]) {
    static_cast<RNSStackNavigationBar *>(navigationController.navigationBar).backButtonMenuEnabled = enabled;
  } else {
    RNSLog(@"An instance of RNSStackNavigationBar is expected for navigation bar implementation");
  }
}
#endif // !TARGET_OS_TV

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = YES;
#endif // !TARGET_OS_TV
}

@end
