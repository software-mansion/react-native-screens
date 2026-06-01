#import "RNSStackNavigationBarCoordinator.h"

@implementation RNSStackNavigationBarCoordinator

- (void)applyConfiguration:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [self setupVisibility:data forNavigationController:navigationController animated:animated];
}

- (void)initializeNavigationBarOfNavigationController:(nonnull UINavigationController *)navigationController
{
#if !TARGET_OS_TV && !TARGET_OS_VISION
  navigationController.navigationBar.prefersLargeTitles = YES;
#endif // !TARGET_OS_TV && !TARGET_OS_VISION
}

- (void)setupVisibility:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:data.hidden animated:animated];
}

@end
