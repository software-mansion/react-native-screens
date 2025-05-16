#import "RNSTabBarAppearanceCoordinator.h"
#import "RNSConversions.h"
#import "RNSTabsScreenViewController.h"

@implementation RNSTabBarAppearanceCoordinator

- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSBottomTabsHostComponentView *)hostComponentView
            tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
{
  if (tabBar == nil) {
    return;
  }

  // Step 1 - start with default appearance
  UITabBarAppearance *appearance = [[UITabBarAppearance alloc] init];

  // Step 2 - general settings
  if (hostComponentView != nil) {
    appearance.backgroundColor = hostComponentView.tabBarBackgroundColor;
    appearance.backgroundEffect = hostComponentView.tabBarBlurEffect;
  }

  // Step 3 - apply general settings to the tab bar
  tabBar.standardAppearance = appearance;
  tabBar.scrollEdgeAppearance = appearance;

  // Step 4 - build the appearance object for each tab & apply it
  if (tabScreenCtrls == nil) {
    return;
  }

  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    if (tabScreenCtrl == nil) {
      // It should not be null here, something went wrong.
      RCTLogWarn(@"[RNScreens] Nullish controller of TabScreen while tab bar appearance update!");
      continue;
    }

    UITabBarAppearance *tabAppearance = [[UITabBarAppearance alloc] initWithBarAppearance:appearance];

    [self configureTabBarItemAppearance:tabAppearance.compactInlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl];
    [self configureTabBarItemAppearance:tabAppearance.inlineLayoutAppearance forTabScreenController:tabScreenCtrl];
    [self configureTabBarItemAppearance:tabAppearance.stackedLayoutAppearance forTabScreenController:tabScreenCtrl];

    tabScreenCtrl.tabBarItem.standardAppearance = tabAppearance;
    tabScreenCtrl.tabBarItem.scrollEdgeAppearance = tabAppearance;
  }
}

- (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
               forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
{
  tabBarItemAppearance.normal.badgeBackgroundColor = tabScreenCtrl.tabScreenComponentView.badgeColor;

  tabBarItemAppearance.selected.badgeBackgroundColor = tabScreenCtrl.tabScreenComponentView.badgeColor;

  tabBarItemAppearance.focused.badgeBackgroundColor = tabScreenCtrl.tabScreenComponentView.badgeColor;

  tabBarItemAppearance.disabled.badgeBackgroundColor = tabScreenCtrl.tabScreenComponentView.badgeColor;
}

@end
