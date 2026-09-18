#import "RNSTabBarItemsCoordinator.h"
#import <React/RCTAssert.h>
#import "RNSTabsScreenComponentView.h"

@implementation RNSTabBarItemsCoordinator

- (void)updateTabBarItemsA11yIfNeededInScreenControllers:
    (nullable NSArray<RNSTabsScreenViewController *> *)screenControllers
{
  for (RNSTabsScreenViewController *screenController in screenControllers) {
    RNSTabsScreenComponentView *screenView = screenController.tabScreenComponentView;
    if (!screenView.tabBarItemNeedsA11yUpdate) {
      continue;
    }

    screenView.tabBarItemNeedsA11yUpdate = NO;
    screenController.tabBarItem.accessibilityIdentifier = screenView.tabItemTestID;
    screenController.tabBarItem.accessibilityLabel = screenView.tabItemAccessibilityLabel;
  }
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

- (BOOL)syncConfigurationOfTabs:(nullable NSArray<__kindof UITab *> *)tabs API_AVAILABLE(ios(18.0))
{
  BOOL tabsDidChange = NO;
  for (UITab *tab in tabs) {
    UIViewController *viewController = tab.viewController;
    RCTAssert([viewController isKindOfClass:RNSTabsScreenViewController.class],
              @"[RNScreens] Unexpected type of controller: %@",
              viewController.class);
    tabsDidChange |= [self syncConfigurationOfTab:tab
                             withScreenController:static_cast<RNSTabsScreenViewController *>(viewController)];
  }
  return tabsDidChange;
}

- (BOOL)syncConfigurationOfTab:(UITab *)tab
          withScreenController:(RNSTabsScreenViewController *)screenController API_AVAILABLE(ios(18.0))
{
  UITabBarItem *item = screenController.tabBarItem;
  RNSTabsScreenComponentView *screenView = screenController.tabScreenComponentView;
  BOOL tabDidChange = NO;

  NSString *newTitle = screenController.title ?: @"";
  if (![tab.title isEqualToString:newTitle]) {
    tab.title = newTitle;
    tabDidChange = YES;
  }

  NSString *_Nullable badgeValue = screenView.badgeValue;
  if (tab.badgeValue != badgeValue && ![tab.badgeValue isEqualToString:badgeValue]) {
    tab.badgeValue = badgeValue;
    tabDidChange = YES;
  }

  /*
   * The bar buttons read accessibility from the tab-managed item, NOT from the `UITab`, and
   * UIKit replaces the items on `tabs` rebuilds. Unconditional writes - the item's a11y
   * getters derive fallbacks (label falls back to title), so change detection can't converge.
   */
  item.accessibilityIdentifier = screenView.tabItemTestID;
  item.accessibilityLabel = screenView.tabItemAccessibilityLabel;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  if (@available(iOS 26.0, *)) {
    if ([tab isKindOfClass:UISearchTab.class]) {
      auto *searchTab = static_cast<UISearchTab *>(tab);

      if (searchTab.automaticallyActivatesSearch != screenView.automaticallyActivatesSearch) {
        searchTab.automaticallyActivatesSearch = screenView.automaticallyActivatesSearch;
      }

      [screenController updateNavigationItemSearchControllerFromNestedStack];
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

  return tabDidChange;
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

@end
