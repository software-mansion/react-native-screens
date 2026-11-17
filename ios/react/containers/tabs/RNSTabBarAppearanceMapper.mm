#import "RNSTabBarAppearanceMapper.h"
#import <React/RCTFont.h>
#import "RCTConvert+RNSTabs.h"
#import "RNSConversions-Tabs.h"

@implementation RNSTabBarAppearanceMapper

+ (void)configureTabBarAppearance:(nonnull UITabBarAppearance *)tabBarAppearance
              fromAppearanceProps:(nonnull NSDictionary *)appearanceProps
{
  if (appearanceProps[@"tabBarBackgroundColor"] != nil) {
    tabBarAppearance.backgroundColor = [RCTConvert UIColor:appearanceProps[@"tabBarBackgroundColor"]];
  }

  if (appearanceProps[@"tabBarBlurEffect"] != nil) {
    NSString *blurEffectString = [appearanceProps[@"tabBarBlurEffect"] isKindOfClass:[NSString class]]
        ? appearanceProps[@"tabBarBlurEffect"]
        : @"none";

    if (![blurEffectString isEqualToString:@"systemDefault"]) {
      tabBarAppearance.backgroundEffect = rnscreens::conversion::RNSUIBlurEffectFromString(blurEffectString);
    }
  }

  if (appearanceProps[@"tabBarShadowColor"] != nil) {
    tabBarAppearance.shadowColor = [RCTConvert UIColor:appearanceProps[@"tabBarShadowColor"]];
  }

  if ([appearanceProps[@"stacked"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemAppearance:tabBarAppearance.stackedLayoutAppearance
                fromItemAppearanceProps:appearanceProps[@"stacked"]];
  }

  if ([appearanceProps[@"inline"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemAppearance:tabBarAppearance.inlineLayoutAppearance
                fromItemAppearanceProps:appearanceProps[@"inline"]];
  }

  if ([appearanceProps[@"compactInline"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemAppearance:tabBarAppearance.compactInlineLayoutAppearance
                fromItemAppearanceProps:appearanceProps[@"compactInline"]];
  }
}

+ (void)configureTabBarItemAppearance:(nonnull UITabBarItemAppearance *)tabBarItemAppearance
              fromItemAppearanceProps:(nonnull NSDictionary *)itemAppearanceProps
{
  if ([itemAppearanceProps[@"normal"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal
                fromItemStateAppearanceProps:itemAppearanceProps[@"normal"]];
  }

  if ([itemAppearanceProps[@"selected"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                fromItemStateAppearanceProps:itemAppearanceProps[@"selected"]];
  }

  if ([itemAppearanceProps[@"focused"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                fromItemStateAppearanceProps:itemAppearanceProps[@"focused"]];
  }

  if ([itemAppearanceProps[@"disabled"] isKindOfClass:[NSDictionary class]]) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                fromItemStateAppearanceProps:itemAppearanceProps[@"disabled"]];
  }
}

+ (void)configureTabBarItemStateAppearance:(nonnull UITabBarItemStateAppearance *)tabBarItemStateAppearance
              fromItemStateAppearanceProps:(nonnull NSDictionary *)itemStateAppearanceProps
{
  NSMutableDictionary *titleTextAttributes = [[NSMutableDictionary alloc] init];

  if (itemStateAppearanceProps[@"tabBarItemTitleFontFamily"] != nil ||
      itemStateAppearanceProps[@"tabBarItemTitleFontSize"] != nil ||
      itemStateAppearanceProps[@"tabBarItemTitleFontWeight"] != nil ||
      itemStateAppearanceProps[@"tabBarItemTitleFontStyle"] != nil) {
    titleTextAttributes[NSFontAttributeName] =
        [RCTFont updateFont:tabBarItemStateAppearance.titleTextAttributes[NSFontAttributeName]
                 withFamily:itemStateAppearanceProps[@"tabBarItemTitleFontFamily"]
                       size:itemStateAppearanceProps[@"tabBarItemTitleFontSize"]
                     weight:itemStateAppearanceProps[@"tabBarItemTitleFontWeight"]
                      style:itemStateAppearanceProps[@"tabBarItemTitleFontStyle"]
                    variant:nil
            scaleMultiplier:1.0];
  }

  if (itemStateAppearanceProps[@"tabBarItemTitleFontColor"] != nil) {
    titleTextAttributes[NSForegroundColorAttributeName] =
        [RCTConvert UIColor:itemStateAppearanceProps[@"tabBarItemTitleFontColor"]];
  }

  if ([titleTextAttributes count] > 0) {
    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  }

  if (itemStateAppearanceProps[@"tabBarItemBadgeBackgroundColor"] != nil) {
    tabBarItemStateAppearance.badgeBackgroundColor =
        [RCTConvert UIColor:itemStateAppearanceProps[@"tabBarItemBadgeBackgroundColor"]];
  }

  if (itemStateAppearanceProps[@"tabBarItemIconColor"] != nil) {
    tabBarItemStateAppearance.iconColor = [RCTConvert UIColor:itemStateAppearanceProps[@"tabBarItemIconColor"]];
  }

  if (itemStateAppearanceProps[@"tabBarItemTitlePositionAdjustment"] != nil) {
    tabBarItemStateAppearance.titlePositionAdjustment =
        [RCTConvert UIOffset:itemStateAppearanceProps[@"tabBarItemTitlePositionAdjustment"]];
  }
}

@end
