#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import "RNSConversions.h"
#import "RNSTabBarAppearanceProvider.h"
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

  //  tabBar.standardAppearance = hostComponentView.tabBarStandardAppearance;
  //  tabBar.scrollEdgeAppearance = hostComponentView.tabBarScrollEdgeAppearance;

  tabBar.tintColor = hostComponentView.tabBarTintColor;

  if (tabScreenCtrls == nil) {
    return;
  }

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

  tabBarItem.standardAppearance = tabScreenCtrl.tabScreenComponentView.tabBarStandardAppearance;
  tabBarItem.scrollEdgeAppearance = tabScreenCtrl.tabScreenComponentView.tabBarScrollEdgeAppearance;

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

+ (void)configureTabBarAppearance:(UITabBarAppearance *)tabBarAppearance fromFolly:(id)appearanceProps
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

  // Inheritance behavior
  if (appearanceProps[@"stacked"] != nil) {
    [self configureTabBarItemAppearance:tabBarAppearance.stackedLayoutAppearance fromFolly:appearanceProps[@"stacked"]];
    [self configureTabBarItemAppearance:tabBarAppearance.inlineLayoutAppearance fromFolly:appearanceProps[@"stacked"]];
    [self configureTabBarItemAppearance:tabBarAppearance.compactInlineLayoutAppearance
                              fromFolly:appearanceProps[@"stacked"]];
  }

  if (appearanceProps[@"inline"] != nil) {
    [self configureTabBarItemAppearance:tabBarAppearance.inlineLayoutAppearance fromFolly:appearanceProps[@"inline"]];
    [self configureTabBarItemAppearance:tabBarAppearance.compactInlineLayoutAppearance
                              fromFolly:appearanceProps[@"inline"]];
  }

  if (appearanceProps[@"compactInline"] != nil) {
    [self configureTabBarItemAppearance:tabBarAppearance.compactInlineLayoutAppearance
                              fromFolly:appearanceProps[@"compactInline"]];
  }
}

+ (void)configureTabBarItemAppearance:(UITabBarItemAppearance *)tabBarItemAppearance fromFolly:(id)itemAppearanceProps
{
  // Inheritance behavior
  if (itemAppearanceProps[@"normal"] != nil) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.normal fromFolly:itemAppearanceProps[@"normal"]];
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected fromFolly:itemAppearanceProps[@"normal"]];
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused fromFolly:itemAppearanceProps[@"normal"]];
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled fromFolly:itemAppearanceProps[@"normal"]];
  }

  if (itemAppearanceProps[@"selected"] != nil) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected fromFolly:itemAppearanceProps[@"selected"]];
  }

  if (itemAppearanceProps[@"focused"] != nil) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused fromFolly:itemAppearanceProps[@"focused"]];
  }

  if (itemAppearanceProps[@"disabled"] != nil) {
    [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled fromFolly:itemAppearanceProps[@"disabled"]];
  }
}

+ (void)configureTabBarItemStateAppearance:(UITabBarItemStateAppearance *)tabBarItemStateAppearance
                                 fromFolly:(id)itemStateAppearanceProps
{
  // TODO: handle color properly
  //  NSMutableDictionary *titleTextAttributes = [[NSMutableDictionary alloc] init];
  //  if (itemStateAppearanceProps[@"tabBarItemTitleFontFamily"] != nil ||
  //      itemStateAppearanceProps[@"tabBarItemTitleFontSize"] != nil ||
  //      itemStateAppearanceProps[@"tabBarItemTitleFontWeight"] != nil ||
  //      itemStateAppearanceProps[@"tabBarItemTitleFontStyle"] != nil) {
  //
  //    titleTextAttributes[NSFontAttributeName] =
  //    [RCTFont updateFont:nil
  //             withFamily:itemStateAppearanceProps[@"tabBarItemTitleFontFamily"]
  //                   size:itemStateAppearanceProps[@"tabBarItemTitleFontSize"]
  //                 weight:itemStateAppearanceProps[@"tabBarItemTitleFontWeight"]
  //                  style:itemStateAppearanceProps[@"tabBarItemTitleFontStyle"]
  //                variant:nil
  //        scaleMultiplier:1.0];
  //  }
  //
  //  if (itemStateAppearanceProps[@"tabBarItemTitleFontColor"] != nil) {
  //    titleTextAttributes[NSForegroundColorAttributeName] = [RCTConvert
  //    UIColor:itemStateAppearanceProps[@"tabBarItemTitleFontColor"]];
  //  }
  //
  //  if (titleTextAttributes != nil) {
  //    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  //  }

  if (itemStateAppearanceProps[@"tabBarItemBadgeBackgroundColor"] != nil) {
    tabBarItemStateAppearance.badgeBackgroundColor =
        [RCTConvert UIColor:itemStateAppearanceProps[@"tabBarItemBadgeBackgroundColor"]];
  }

  if (itemStateAppearanceProps[@"tabBarItemIconColor"] != nil) {
    tabBarItemStateAppearance.iconColor = [RCTConvert UIColor:itemStateAppearanceProps[@"tabBarItemIconColor"]];
  }

  // TODO: correctly handle titlePositionAdjustment (1. convert, 2. (0,0) case)
  //  tabBarItemStateAppearance.titlePositionAdjustment = itemStateAppearanceProps[@"titlePositionAdjustment"];
}

@end
