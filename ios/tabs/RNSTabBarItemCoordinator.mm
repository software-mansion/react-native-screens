#import "RNSTabBarItemCoordinator.h"
#import <React/RCTLog.h>
#import "RNSDefines.h"

static BOOL RNSUITabBarSystemItemFromTabsScreenSystemItem(RNSTabsScreenSystemItem systemItem,
                                                          UITabBarSystemItem *outSystemItem)
{
  switch (systemItem) {
    case RNSTabsScreenSystemItemNone:
      return NO;
    case RNSTabsScreenSystemItemBookmarks:
      *outSystemItem = UITabBarSystemItemBookmarks;
      return YES;
    case RNSTabsScreenSystemItemContacts:
      *outSystemItem = UITabBarSystemItemContacts;
      return YES;
    case RNSTabsScreenSystemItemDownloads:
      *outSystemItem = UITabBarSystemItemDownloads;
      return YES;
    case RNSTabsScreenSystemItemFavorites:
      *outSystemItem = UITabBarSystemItemFavorites;
      return YES;
    case RNSTabsScreenSystemItemFeatured:
      *outSystemItem = UITabBarSystemItemFeatured;
      return YES;
    case RNSTabsScreenSystemItemHistory:
      *outSystemItem = UITabBarSystemItemHistory;
      return YES;
    case RNSTabsScreenSystemItemMore:
      *outSystemItem = UITabBarSystemItemMore;
      return YES;
    case RNSTabsScreenSystemItemMostRecent:
      *outSystemItem = UITabBarSystemItemMostRecent;
      return YES;
    case RNSTabsScreenSystemItemMostViewed:
      *outSystemItem = UITabBarSystemItemMostViewed;
      return YES;
    case RNSTabsScreenSystemItemRecents:
      *outSystemItem = UITabBarSystemItemRecents;
      return YES;
    case RNSTabsScreenSystemItemSearch:
      *outSystemItem = UITabBarSystemItemSearch;
      return YES;
    case RNSTabsScreenSystemItemTopRated:
      *outSystemItem = UITabBarSystemItemTopRated;
      return YES;
  }
  return NO;
}

@implementation RNSTabBarItemCoordinator

+ (nullable UITabBarItem *)tabBarItemWithSystemItem:(RNSTabsScreenSystemItem)systemItem
{
  UITabBarSystemItem uiSystemItem;
  if (!RNSUITabBarSystemItemFromTabsScreenSystemItem(systemItem, &uiSystemItem)) {
    return nil;
  }
  return [[UITabBarItem alloc] initWithTabBarSystemItem:uiSystemItem tag:0];
}

/**
 * Creates UITabBarItem instance with set systemItem. Needs to be called before UITab creation for the same
 * viewController.
 */
- (void)createTabBarItemsForTabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
{
  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    UIView<RNSTabsScreenDataProviding> *screenView = tabScreenCtrl.tabScreenView;
    if (screenView == nil) {
      RCTLogWarn(@"[RNScreens] Nullish view of TabScreen while tab bar item creation!");
      continue;
    }

    if (screenView.tabBarItemNeedsRecreation) {
      screenView.tabBarItemNeedsRecreation = NO;
      [self createTabBarItemForTabScreenController:tabScreenCtrl];
    }
  }
}

/**
 * Updates the runtime properties of UITabBarItem: title and badge. If used with UITab API, it should be called after
 * the tab is built.
 */
- (void)updateTabBarItemsForTabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
{
  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    UIView<RNSTabsScreenDataProviding> *screenView = tabScreenCtrl.tabScreenView;
    if (screenView == nil) {
      RCTLogWarn(@"[RNScreens] Nullish view of TabScreen while tab bar item update!");
      continue;
    }

    if (screenView.tabBarItemNeedsUpdate) {
      screenView.tabBarItemNeedsUpdate = NO;
      [self updateTabBarItemForTabScreenController:tabScreenCtrl];
    }
  }
}

- (void)createTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
  UIView<RNSTabsScreenDataProviding> *screenView = tabScreenCtrl.tabScreenView;

  UITabBarItem *tabBarItem = nil;
  if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
    tabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
    if (tabBarItem == nil) {
      RCTLogError(
          @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
          (long)screenView.systemItem);
      return;
    }
  } else {
    tabBarItem = [[UITabBarItem alloc] init];
  }

  [self applyTabBarItemRepaintWorkaroundForTabScreenController:tabScreenCtrl];
  tabScreenCtrl.tabBarItem = tabBarItem;
}

/**
 * TODO: This is an ugly workaround and I would love to see it replaced.
 * With UITab-managed children (iOS >= 26.1) any change to the systemItem for the first time
 * results in missing icon and wrong title. Assigning a throwaway item first flips the internal logic
 * so that the real assignment that follows paints synchronously.
 * Remove once UIKit internals no longer require it.
 */
- (void)applyTabBarItemRepaintWorkaroundForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
#if RNS_UITAB_API_SDK_AVAILABLE
  if (RNS_UITAB_API_ENABLED) {
    tabScreenCtrl.tabBarItem = [[UITabBarItem alloc] init];
  }
#endif // RNS_UITAB_API_SDK_AVAILABLE
}

- (void)updateTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
  UIView<RNSTabsScreenDataProviding> *screenView = tabScreenCtrl.tabScreenView;

  NSString *evaluatedTitle = screenView.title;
  if (screenView.title == nil && screenView.systemItem != RNSTabsScreenSystemItemNone) {
    // Restore default system item title
    UITabBarItem *systemTabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
    if (systemTabBarItem == nil) {
      RCTLogError(
          @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
          (long)screenView.systemItem);
      return;
    }
    evaluatedTitle = systemTabBarItem.title;
  }

  [self updateTabBarItemTitle:evaluatedTitle forTabScreenController:tabScreenCtrl];
  [self updateTabBarItemBadge:screenView.badgeValue forTabScreenController:tabScreenCtrl];
}

- (void)updateTabBarItemTitle:(NSString *)newTitle
       forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
  // Setting controller title updates also controller's tabBarItem.title but only if there
  // is a change to controller title. After creating new tabBarItem, controller title
  // remains the same but tabBarItem.title is nil. For consistency, we always
  // update both.
  if (![tabScreenCtrl.tabBarItem.title isEqualToString:newTitle] || ![tabScreenCtrl.title isEqualToString:newTitle]) {
    tabScreenCtrl.title = newTitle;
    tabScreenCtrl.tabBarItem.title = newTitle;
#if RNS_UITAB_API_SDK_AVAILABLE
    if (RNS_UITAB_API_ENABLED) {
      // iPad sources the rendered title from the tab, not the item.
      tabScreenCtrl.tab.title = newTitle;
    }
#endif // RNS_UITAB_API_SDK_AVAILABLE
  }
}

- (void)updateTabBarItemBadge:(NSString *)badgeValue
       forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
  if (![tabScreenCtrl.tabBarItem.badgeValue isEqualToString:badgeValue]) {
    // The badge must land on both the item (viewController API) and the tab (UITab API) to render.
    tabScreenCtrl.tabBarItem.badgeValue = badgeValue;
#if RNS_UITAB_API_SDK_AVAILABLE
    if (RNS_UITAB_API_ENABLED) {
      tabScreenCtrl.tab.badgeValue = badgeValue;
    }
#endif // RNS_UITAB_API_SDK_AVAILABLE
  }
}

@end
