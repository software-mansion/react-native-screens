#import "RNSTabBarItemCoordinator.h"
#import <React/RCTLog.h>
#import "RNSConversions-Tabs.h"
#import "RNSDefines.h"
#import "RNSTabsScreenComponentView.h"

@implementation RNSTabBarItemCoordinator

/**
 * Creates UITabBarItem instance with set systemItem. Needs to be called before UITab creation for the same
 * viewController.
 */
- (void)createTabBarItemsForTabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
{
  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    RNSTabsScreenComponentView *screenView = tabScreenCtrl.tabScreenComponentView;
    if (screenView == nil) {
      RCTLogWarn(@"[RNScreens] Nullish component view of TabScreen while tab bar item creation!");
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
    RNSTabsScreenComponentView *screenView = tabScreenCtrl.tabScreenComponentView;
    if (screenView == nil) {
      RCTLogWarn(@"[RNScreens] Nullish component view of TabScreen while tab bar item update!");
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
  RNSTabsScreenComponentView *screenView = tabScreenCtrl.tabScreenComponentView;

  UITabBarItem *tabBarItem = nil;
  if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
    std::optional<UITabBarSystemItem> systemItem =
        rnscreens::conversion::RNSTabsScreenSystemItemToUITabBarSystemItem(screenView.systemItem);
    if (!systemItem) {
      RCTLogError(
          @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
          (long)screenView.systemItem);
      return;
    }
    tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem.value() tag:0];
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
  RNSTabsScreenComponentView *screenView = tabScreenCtrl.tabScreenComponentView;

  NSString *evaluatedTitle = screenView.title;
  if (screenView.title == nil && screenView.systemItem != RNSTabsScreenSystemItemNone) {
    // Restore default system item title
    std::optional<UITabBarSystemItem> systemItem =
        rnscreens::conversion::RNSTabsScreenSystemItemToUITabBarSystemItem(screenView.systemItem);
    if (!systemItem) {
      RCTLogError(
          @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
          (long)screenView.systemItem);
      return;
    }
    evaluatedTitle = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem.value() tag:0].title;
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
