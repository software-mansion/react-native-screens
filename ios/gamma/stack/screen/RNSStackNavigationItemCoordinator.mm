#import "RNSStackNavigationItemCoordinator.h"
#import "RNSDefines.h"
#import "RNSStackScreenController.h"

@implementation RNSStackNavigationItemCoordinator

#pragma mark - Public

- (void)applyConfiguration:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  [self setupTitleIfNeeded:data forController:controller];
  [self setupLargeTitleDisplayModeIfNeeded:data forController:controller];
  [self setupBarButtonItemsIfNeeded:data forController:controller];
}

- (void)setupTitleIfNeeded:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

  navItem.titleView = data.titleView;

  NSString *title = data.title;
  NSString *largeTitle = data.largeTitle;
  if (data.largeTitleEnabled && largeTitle.length > 0) {
    navItem.title = largeTitle;
  } else {
    navItem.title = title;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.subtitle = data.subtitle;
    navItem.subtitleView = data.subtitleView;
    navItem.largeSubtitleView = data.largeSubtitleView;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)setupLargeTitleDisplayModeIfNeeded:(RNSStackHeaderData *)data
                             forController:(nonnull RNSStackScreenController *)controller
{
#if !TARGET_OS_TV
  controller.navigationItem.largeTitleDisplayMode =
      data.largeTitleEnabled ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
}

- (void)setupBarButtonItemsIfNeeded:(RNSStackHeaderData *)data
                      forController:(nonnull RNSStackScreenController *)controller
{
#if !TARGET_OS_TV
  controller.navigationItem.leftItemsSupplementBackButton = YES;
#endif // !TARGET_OS_TV
  [controller.navigationItem setLeftBarButtonItems:data.leadingBarButtonItems animated:YES];
  [controller.navigationItem setRightBarButtonItems:data.trailingBarButtonItems animated:YES];
}

@end
