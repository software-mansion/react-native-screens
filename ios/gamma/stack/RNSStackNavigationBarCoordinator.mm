#import "RNSStackNavigationBarCoordinator.h"

@implementation RNSStackNavigationBarCoordinator

- (void)applyConfiguration:(RNSStackHeaderData *)data
   forNavigationController:(nonnull UINavigationController *)navigationController
                  animated:(BOOL)animated
{
  [self setupVisibilityIfNeeded:data forNavigationController:navigationController animated:animated];
  [self setupLargeTitleIfNeeded:data forNavigationController:navigationController];
}

- (void)setupVisibilityIfNeeded:(RNSStackHeaderData *)data
        forNavigationController:(nonnull UINavigationController *)navigationController
                       animated:(BOOL)animated
{
  [navigationController setNavigationBarHidden:data.hidden animated:animated];
}

- (void)setupLargeTitleIfNeeded:(RNSStackHeaderData *)data
        forNavigationController:(nonnull UINavigationController *)navigationController
{
#if !TARGET_OS_TV
  navigationController.navigationBar.prefersLargeTitles = data.largeTitle;
#endif
}

@end
