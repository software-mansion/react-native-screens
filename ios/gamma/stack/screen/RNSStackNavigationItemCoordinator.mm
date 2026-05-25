#import "RNSStackNavigationItemCoordinator.h"
#import "RNSDefines.h"
#import "RNSStackScreenController.h"

@implementation RNSStackNavigationItemCoordinator

- (void)applyConfiguration:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  [self setupTitle:data forController:controller];
  [self setupSubtitle:data forController:controller];
  [self setupLargeTitleDisplayMode:data forController:controller];
  [self setupBarButtonItems:data forController:controller];
}

- (void)setupTitle:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

  navItem.titleView = data.titleView;
  navItem.title = data.title;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.largeTitle = data.largeTitleEnabled ? data.largeTitle : nil;
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (data.largeTitleEnabled && data.largeTitle.length > 0) {
      navItem.title = data.largeTitle;
    }
}

- (void)setupSubtitle:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    UINavigationItem *navItem = controller.navigationItem;
    navItem.subtitle = data.subtitle;
    navItem.largeSubtitle = data.largeSubtitle;
    navItem.subtitleView = data.subtitleView;
    navItem.largeSubtitleView = data.largeSubtitleView;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)setupLargeTitleDisplayMode:(RNSStackHeaderData *)data
                     forController:(nonnull RNSStackScreenController *)controller
{
#if !TARGET_OS_TV
  controller.navigationItem.largeTitleDisplayMode =
      data.largeTitleEnabled ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
}

- (void)setupBarButtonItems:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
#if !TARGET_OS_TV
  controller.navigationItem.leftItemsSupplementBackButton = YES;
#endif // !TARGET_OS_TV
  [controller.navigationItem setLeftBarButtonItems:data.leadingBarButtonItems animated:YES];
  [controller.navigationItem setRightBarButtonItems:data.trailingBarButtonItems animated:YES];
}

@end
