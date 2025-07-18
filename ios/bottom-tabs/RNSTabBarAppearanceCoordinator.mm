#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
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

  // Step 1 - apply host-related appearance props
  tabBar.tintColor = hostComponentView.tabBarTintColor;

  // Step 2 - build the appearance object for each tab & apply it
  if (tabScreenCtrls == nil) {
    return;
  }

  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    if (tabScreenCtrl == nil) {
      // It should not be null here, something went wrong.
      RCTLogWarn(@"[RNScreens] Nullish controller of TabScreen while tab bar appearance update!");
      continue;
    }

    if (tabScreenCtrl.tabScreenComponentView == nil) {
      RCTLogWarn(@"[RNScreens] Nullish TabScreen while tab bar appearance update!");
      continue;
    }

    // Start with default appearance
    UITabBarAppearance *tabAppearance = [[UITabBarAppearance alloc] init];

    [self configureTabBarAppearance:tabAppearance fromTabsScreen:tabScreenCtrl.tabScreenComponentView];

    [self configureTabBarItemAppearance:tabAppearance.compactInlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.inlineLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];
    [self configureTabBarItemAppearance:tabAppearance.stackedLayoutAppearance
                 forTabScreenController:tabScreenCtrl
                  withHostComponentView:hostComponentView];

    [self configureTabBarItemForTabScreenController:tabScreenCtrl withAppearace:tabAppearance imageLoader:imageLoader];
  }
}

- (void)configureTabBarAppearance:(nonnull UITabBarAppearance *)appearance
                   fromTabsScreen:(nonnull RNSBottomTabsScreenComponentView *)tabsScreen
{
  if (tabsScreen.tabBarBackgroundColor != nil) {
    appearance.backgroundColor = tabsScreen.tabBarBackgroundColor;
  }

  switch (tabsScreen.tabBarBlurEffect) {
    case RNSBlurEffectStyleNone:
      appearance.backgroundEffect = nil;
      break;

    case RNSBlurEffectStyleSystemDefault:
      // Initialized appearance already has default blur effect.

      // This won't work as expected with current inheriting appearance logic:
      // screen will not revert to default but inherit blur from host
      // TODO: remove appearance inheritance
      break;

    default:
      appearance.backgroundEffect =
          rnscreens::conversion::RNSUIBlurEffectFromRNSBlurEffectStyle(tabsScreen.tabBarBlurEffect);
  }
}

- (void)configureTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                                    withAppearace:(nonnull UITabBarAppearance *)tabAppearance
                                      imageLoader:(nullable RCTImageLoader *)imageLoader
{
  UITabBarItem *tabBarItem = tabScreenCtrl.tabBarItem;

  tabBarItem.standardAppearance = tabAppearance;
  tabBarItem.scrollEdgeAppearance = tabAppearance;

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
                            withTabsScreen:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.selected
                            withTabsScreen:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.focused
                            withTabsScreen:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
  [self configureTabBarItemStateAppearance:tabBarItemAppearance.disabled
                            withTabsScreen:tabScreenCtrl.tabScreenComponentView
                   withTitleTextAttributes:titleTextAttributes];
}

- (void)configureTabBarItemStateAppearance:(nonnull UITabBarItemStateAppearance *)tabBarItemStateAppearance
                            withTabsScreen:(nonnull RNSBottomTabsScreenComponentView *)tabsScreen
                   withTitleTextAttributes:(nullable NSDictionary<NSAttributedStringKey, id> *)titleTextAttributes
{
  if (tabsScreen.tabBarItemBadgeBackgroundColor != nil) {
    tabBarItemStateAppearance.badgeBackgroundColor = tabsScreen.tabBarItemBadgeBackgroundColor;
  }

  if (titleTextAttributes != nil) {
    tabBarItemStateAppearance.titleTextAttributes = titleTextAttributes;
  }

  if (tabsScreen.tabBarItemIconColor != nil) {
    tabBarItemStateAppearance.iconColor = tabsScreen.tabBarItemIconColor;
  }

  tabBarItemStateAppearance.titlePositionAdjustment = tabsScreen.tabBarItemTitlePositionAdjustment;
}

@end
