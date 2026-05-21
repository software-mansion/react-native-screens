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
  navigationController.navigationBar.prefersLargeTitles = YES;
}

- (void)setupVisibility:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:data.hidden animated:animated];
}

@end
