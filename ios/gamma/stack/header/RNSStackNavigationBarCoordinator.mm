#import "RNSStackNavigationBarCoordinator.h"

@implementation RNSStackNavigationBarCoordinator

- (void)applyConfiguration:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [self setupVisibility:data forNavigationController:navigationController animated:animated];
  [self setupLargeTitle:data forNavigationController:navigationController];
}

- (void)setupVisibility:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:data.hidden animated:animated];
}

- (void)setupLargeTitle:(RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = data.largeTitleEnabled;
#endif
}

@end
