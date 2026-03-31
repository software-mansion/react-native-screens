#import "RNSStackNavigationItemCoordinator.h"
#import "RNSDefines.h"
#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackScreenController.h"

@implementation RNSStackNavigationItemCoordinator

#pragma mark - Public

- (void)applyConfiguration:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  [self setupTitleIfNeeded:data forController:controller];
  [self setupLargeTitleDisplayModeIfNeeded:data forController:controller];
  [self setupBarButtonItemsIfNeeded:data forController:controller];
}

- (void)updateShadowStatesOfItems:(nonnull NSArray<RNSStackHeaderItemComponentView *> *)items
                  inNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  for (RNSStackHeaderItemComponentView *item in items) {
    if (item.hasCustomView) {
      [item updateShadowStateToMatchNavigationBar:navigationBar];
    }
  }
}

- (void)setupTitleIfNeeded:(RNSStackHeaderData *)data forController:(nonnull RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

  navItem.titleView = data.titleView;

  NSString *title = data.title;
  navItem.title = title.length > 0 ? title : data.screenKey;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
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
      data.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
#endif
}

- (void)setupBarButtonItemsIfNeeded:(RNSStackHeaderData *)data
                      forController:(nonnull RNSStackScreenController *)controller
{
  controller.navigationItem.leftItemsSupplementBackButton = YES;
  [controller.navigationItem setLeftBarButtonItems:data.leftBarButtonItems animated:YES];
  [controller.navigationItem setRightBarButtonItems:data.rightBarButtonItems animated:YES];
}

@end
