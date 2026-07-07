#import "RNSStackNavigationBarCoordinator.h"

@implementation RNSStackNavigationBarCoordinator

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:hidden animated:animated];
}

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = YES;
#endif // !TARGET_OS_TV
}

@end
