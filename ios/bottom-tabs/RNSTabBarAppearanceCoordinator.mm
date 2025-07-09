#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import "RNSConversions.h"
#import "RNSTabBarAppearanceProvider.h"
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
    [self configureTabBarAppearance:appearance fromAppearanceProvider:hostComponentView];

    [self configureTabBarItemAppearance:appearance.stackedLayoutAppearance withTabsHost:hostComponentView];
    [self configureTabBarItemAppearance:appearance.compactInlineLayoutAppearance withTabsHost:hostComponentView];
    [self configureTabBarItemAppearance:appearance.inlineLayoutAppearance withTabsHost:hostComponentView];
  }

  // Step 3 - apply general settings to the tab bar
  tabBar.standardAppearance = appearance;
  tabBar.scrollEdgeAppearance = appearance;

  tabBar.tintColor = hostComponentView.tabBarTintColor;

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

    [self configureTabBarAppearance:tabAppearance fromAppearanceProvider:tabScreenCtrl.tabScreenComponentView];

    [self configureTabBarItemAppearance:tabAppearance.compactInlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.inlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.stackedLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];

    [self configureTabBarItemForTabScreenController:tabScreenCtrl withAppearace:tabAppearance];
  }
}

- (void)configureTabBarAppearance:(nonnull UITabBarAppearance *)appearance
           fromAppearanceProvider:(id<RNSTabBarAppearanceProvider>)appearanceProvider
{
  if (appearanceProvider.tabBarBackgroundColor != nil) {
    appearance.backgroundColor = appearanceProvider.tabBarBackgroundColor;
  }

  if (appearanceProvider.tabBarBlurEffect != nil) {
    appearance.backgroundEffect = appearanceProvider.tabBarBlurEffect;
  }
}

- (void)configureTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                                    withAppearace:(nonnull UITabBarAppearance *)tabAppearance
{
  UITabBarItem *tabBarItem = tabScreenCtrl.tabBarItem;

  tabBarItem.standardAppearance = tabAppearance;
  tabBarItem.scrollEdgeAppearance = tabAppearance;

  tabBarItem.image = [UIImage systemImageNamed:tabScreenCtrl.tabScreenComponentView.iconSFSymbolName];
  tabBarItem.selectedImage = [UIImage systemImageNamed:tabScreenCtrl.tabScreenComponentView.selectedIconSFSymbolName];
}

- (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
                         withTabsHost:(nonnull RNSBottomTabsHostComponentView *)hostComponent
{
  NSMutableDictionary *titleTextAttributes = nil;

  if (hostComponent.tabBarItemTitleFontSize != nil) {
    titleTextAttributes = [[NSMutableDictionary alloc] init];
    titleTextAttributes[NSFontAttributeName] = [RCTFont updateFont:nil
                                                        withFamily:hostComponent.tabBarItemTitleFontFamily
                                                              size:hostComponent.tabBarItemTitleFontSize
                                                            weight:hostComponent.tabBarItemTitleFontWeight
                                                             style:hostComponent.tabBarItemTitleFontStyle
                                                           variant:nil
                                                   scaleMultiplier:1.0];
    titleTextAttributes[NSForegroundColorAttributeName] = hostComponent.tabBarItemTitleFontColor;
  }

  [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal
                    withAppearanceProvider:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                    withAppearanceProvider:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                    withAppearanceProvider:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                    withAppearanceProvider:hostComponent
                   withTitleTextAttributes:titleTextAttributes];
}

- (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
               forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                withHostComponentView:(nonnull RNSBottomTabsHostComponentView *)tabsHostComponent
{
  NSMutableDictionary *titleTextAttributes = nil;

  if (tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontSize != nil) {
    titleTextAttributes = [[NSMutableDictionary alloc] init];
    titleTextAttributes[NSFontAttributeName] =
        [RCTFont updateFont:nil
                 withFamily:tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontFamily
                       size:tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontSize
                     weight:tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontWeight
                      style:tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontStyle
                    variant:nil
            scaleMultiplier:1.0];
    titleTextAttributes[NSForegroundColorAttributeName] = tabScreenCtrl.tabScreenComponentView.tabBarItemTitleFontColor;
  }

  [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal
                    withAppearanceProvider:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                    withAppearanceProvider:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                    withAppearanceProvider:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                    withAppearanceProvider:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
}

- (void)configureTabBarItemStateAppearance:(nonnull UITabBarItemStateAppearance *)tabBarItemStateAppearance
                    withAppearanceProvider:(id<RNSTabBarAppearanceProvider>)appearanceProvider
                   withTitleTextAttributes:(nullable NSDictionary<NSAttributedStringKey, id> *)titleTextAttributes
{
  if (appearanceProvider.tabBarItemBadgeBackgroundColor != nil) {
    tabBarItemStateAppearance.badgeBackgroundColor = appearanceProvider.tabBarItemBadgeBackgroundColor;
  }

  if (titleTextAttributes != nil) {
    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  }

  if (appearanceProvider.tabBarItemIconColor != nil) {
    tabBarItemStateAppearance.iconColor = appearanceProvider.tabBarItemIconColor;
  }

  tabBarItemStateAppearance.titlePositionAdjustment = appearanceProvider.tabBarItemTitlePositionAdjustment;
}

@end
