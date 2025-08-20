#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import "RCTConvert+RNSBottomTabs.h"
#import "RNSConversions.h"
#import "RNSTabsScreenViewController.h"

@implementation RNSTabBarAppearanceCoordinator

- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSBottomTabsHostComponentView *)hostComponentView
            tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                     imageLoader:(nullable RCTImageLoader *)imageLoader
{
  if (tabBar == nil) {
    return;
  }

  // Step 1 - configure host-specific appearance
  tabBar.tintColor = hostComponentView.tabBarTintColor;

  if (tabScreenCtrls == nil) {
    return;
  }

  // Step 2 - configure screen-specific appearance
  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    if (tabScreenCtrl == nil) {
      // It should not be null here, something went wrong.
      RCTLogWarn(@"[RNScreens] Nullish controller of TabScreen while tab bar appearance update!");
      continue;
    }

    [self configureTabBarItemForTabScreenController:tabScreenCtrl imageLoader:imageLoader];
  }
}

- (void)configureTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                                      imageLoader:(nullable RCTImageLoader *)imageLoader
{
  UITabBarItem *tabBarItem = tabScreenCtrl.tabBarItem;

  tabBarItem.standardAppearance = tabScreenCtrl.tabScreenComponentView.standardAppearance;
  tabBarItem.scrollEdgeAppearance = tabScreenCtrl.tabScreenComponentView.scrollEdgeAppearance;

  [self setIconsForTabBarItem:tabBarItem
               fromScreenView:tabScreenCtrl.tabScreenComponentView
              withImageLoader:imageLoader];
}

- (void)setIconsForTabBarItem:(UITabBarItem *)tabBarItem
               fromScreenView:(RNSBottomTabsScreenComponentView *)screenView
              withImageLoader:(RCTImageLoader *_Nullable)imageLoader
{
  if (screenView.iconType == RNSBottomTabsIconTypeSfSymbol) {
    tabBarItem.image = [UIImage systemImageNamed:screenView.iconSfSymbolName];
    tabBarItem.selectedImage = [UIImage systemImageNamed:screenView.selectedIconSfSymbolName];
  } else if (imageLoader != nil) {
    bool isTemplate = screenView.iconType == RNSBottomTabsIconTypeTemplate;

    // Normal icon
    if (screenView.iconImageSource != nil) {
      [self loadImageFrom:screenView.iconImageSource
          withImageLoader:imageLoader
               asTemplate:isTemplate
          completionBlock:^(UIImage *image) {
            tabBarItem.image = image;
          }];
    } else {
      tabBarItem.image = nil;
    }

    // Selected icon
    if (screenView.selectedIconImageSource != nil) {
      [self loadImageFrom:screenView.selectedIconImageSource
          withImageLoader:imageLoader
               asTemplate:isTemplate
          completionBlock:^(UIImage *image) {
            tabBarItem.selectedImage = image;
          }];
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else {
    RCTLogWarn(@"[RNScreens] unable to load tab bar item icons: imageLoader should not be nil");
  }
}

- (void)loadImageFrom:(nonnull RCTImageSource *)imageSource
      withImageLoader:(nonnull RCTImageLoader *)imageLoader
           asTemplate:(bool)isTemplate
      completionBlock:(void (^)(UIImage *image))imageLoadingCompletionBlock
{
  RCTAssert(imageSource != nil, @"[RNScreens] imageSource must not be nil");
  RCTAssert(imageLoader != nil, @"[RNScreens] imageLoader must not be nil");

  [imageLoader loadImageWithURLRequest:imageSource.request
      size:imageSource.size
      scale:imageSource.scale
      clipped:true
      resizeMode:RCTResizeModeContain
      progressBlock:^(int64_t progress, int64_t total) {
      }
      partialLoadBlock:^(UIImage *_Nonnull image) {
      }
      completionBlock:^(NSError *_Nullable error, UIImage *_Nullable image) {
        dispatch_async(dispatch_get_main_queue(), ^{
          if (isTemplate) {
            imageLoadingCompletionBlock([image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate]);
          } else {
            imageLoadingCompletionBlock([image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]);
          }
        });
      }];
}

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
        [RCTFont updateFont:nil
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
