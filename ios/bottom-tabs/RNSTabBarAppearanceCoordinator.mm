#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
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

    [self configureTabBarItemAppearance:appearance.stackedLayoutAppearance withTabsHost:hostComponentView];
    [self configureTabBarItemAppearance:appearance.compactInlineLayoutAppearance withTabsHost:hostComponentView];
    [self configureTabBarItemAppearance:appearance.inlineLayoutAppearance withTabsHost:hostComponentView];
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

    // Inherit general properties from host
    UITabBarAppearance *tabAppearance = [[UITabBarAppearance alloc] initWithBarAppearance:appearance];

    [self configureTabBarItemAppearance:tabAppearance.compactInlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.inlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.stackedLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];

    tabScreenCtrl.tabBarItem.standardAppearance = tabAppearance;
    tabScreenCtrl.tabBarItem.scrollEdgeAppearance = tabAppearance;
  }
}

- (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
                         withTabsHost:(nonnull RNSBottomTabsHostComponentView *)hostComponent
{
  NSMutableDictionary *titleTextAttributes = nil;

  if (hostComponent.tabBarItemTitleFontSize != nil) {
    titleTextAttributes = [[NSMutableDictionary alloc] init];
    titleTextAttributes[NSFontAttributeName] = [RCTFont updateFont:nil
                                                        withFamily:nil
                                                              size:hostComponent.tabBarItemTitleFontSize
                                                            weight:nil
                                                             style:nil
                                                           variant:nil
                                                   scaleMultiplier:1.0];
  }

  [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal
                              withTabsHost:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                              withTabsHost:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                              withTabsHost:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                              withTabsHost:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
}

- (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
               forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                withHostComponentView:(nonnull RNSBottomTabsHostComponentView *)tabsHostComponent
{
  NSMutableDictionary *titleTextAttributes = nil;

  if (tabScreenCtrl.tabScreenComponentView.titleFontSize != nil) {
    titleTextAttributes = [[NSMutableDictionary alloc] init];
    titleTextAttributes[NSFontAttributeName] = [RCTFont updateFont:nil
                                                        withFamily:nil
                                                              size:tabScreenCtrl.tabScreenComponentView.titleFontSize
                                                            weight:nil
                                                             style:nil
                                                           variant:nil
                                                   scaleMultiplier:1.0];
  }

  [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal
                    forTabScreenController:tabScreenCtrl
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                    forTabScreenController:tabScreenCtrl
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                    forTabScreenController:tabScreenCtrl
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                    forTabScreenController:tabScreenCtrl
                   withTitleTextAttributes:titleTextAttributes];
}

- (void)configureTabBarItemStateAppearance:(nonnull UITabBarItemStateAppearance *)tabBarItemStateAppearance
                    forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                   withTitleTextAttributes:(nullable NSDictionary<NSAttributedStringKey, id> *)titleTextAttributes
{
  tabBarItemStateAppearance.badgeBackgroundColor = tabScreenCtrl.tabScreenComponentView.badgeColor;

  if (titleTextAttributes != nil) {
    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  }
}

- (void)configureTabBarItemStateAppearance:(nonnull UITabBarItemStateAppearance *)tabBarItemStateAppearance
                              withTabsHost:(nonnull RNSBottomTabsHostComponentView *)hostComponent
                   withTitleTextAttributes:(nullable NSDictionary<NSAttributedStringKey, id> *)titleTextAttributes
{
  if (titleTextAttributes != nil) {
    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  }
}

@end
