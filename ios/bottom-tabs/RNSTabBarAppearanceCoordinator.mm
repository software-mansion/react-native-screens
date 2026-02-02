#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import "RCTConvert+RNSBottomTabs.h"
#import "RNSConversions.h"
#import "RNSImageLoadingHelper.h"
#import "RNSTabBarController.h"
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

  // Set tint color for iPadOS tab bar. This is the official way recommended by Apple:
  // https://developer.apple.com/forums/thread/761056?answerId=798245022#798245022
  hostComponentView.controller.view.tintColor = hostComponentView.tabBarTintColor;

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
  if (screenView.iconType == RNSBottomTabsIconTypeSfSymbol || screenView.iconType == RNSBottomTabsIconTypeXcasset) {
    if (screenView.iconResourceName != nil) {
      if (screenView.iconType == RNSBottomTabsIconTypeSfSymbol) {
        tabBarItem.image = [UIImage systemImageNamed:screenView.iconResourceName];
      } else {
        tabBarItem.image = [UIImage imageNamed:screenView.iconResourceName];
      }
    } else if (screenView.systemItem != RNSBottomTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarSystemItem systemItem =
          rnscreens::conversion::RNSBottomTabsScreenSystemItemToUITabBarSystemItem(screenView.systemItem);
      tabBarItem.image = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0].image;
    } else {
      tabBarItem.image = nil;
    }

    if (screenView.selectedIconResourceName != nil) {
      if (screenView.iconType == RNSBottomTabsIconTypeSfSymbol) {
        tabBarItem.selectedImage = [UIImage systemImageNamed:screenView.selectedIconResourceName];
      } else {
        tabBarItem.selectedImage = [UIImage imageNamed:screenView.selectedIconResourceName];
      }
    } else if (screenView.systemItem != RNSBottomTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarSystemItem systemItem =
          rnscreens::conversion::RNSBottomTabsScreenSystemItemToUITabBarSystemItem(screenView.systemItem);
      tabBarItem.selectedImage = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0].selectedImage;
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else if (imageLoader != nil) {
    bool isTemplate = screenView.iconType == RNSBottomTabsIconTypeTemplate;

    // Normal icon
    if (screenView.iconImageSource != nil) {
      [RNSImageLoadingHelper loadImageFromSource:screenView.iconImageSource
                                 withImageLoader:imageLoader
                                      asTemplate:isTemplate
                                 completionBlock:^(UIImage *image) {
                                   [self updateTabBarItem:tabBarItem
                                                withImage:image
                                               isSelected:NO
                                            forScreenView:screenView];
                                 }];
    } else {
      tabBarItem.image = nil;
    }

    // Selected icon
    if (screenView.selectedIconImageSource != nil) {
      [RNSImageLoadingHelper loadImageFromSource:screenView.selectedIconImageSource
                                 withImageLoader:imageLoader
                                      asTemplate:isTemplate
                                 completionBlock:^(UIImage *image) {
                                   [self updateTabBarItem:tabBarItem
                                                withImage:image
                                               isSelected:YES
                                            forScreenView:screenView];
                                 }];
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else {
    RCTLogWarn(@"[RNScreens] unable to load tab bar item icons: imageLoader should not be nil");
  }
}

- (void)updateTabBarItem:(UITabBarItem *)tabBarItem
               withImage:(UIImage *)image
              isSelected:(BOOL)isSelected
           forScreenView:(RNSBottomTabsScreenComponentView *)screenView
{
  if (isSelected) {
    tabBarItem.selectedImage = image;
  } else {
    tabBarItem.image = image;
  }

  // A layout pass is required because the image might be loaded asynchronously,
  // after the tab bar has already been attached to the window.
  // This code handles case where image passed by the user is not 
  // of appropriate size & needs to be readjusted. W/o additional 
  // layout here the icon would be displayed with original dimensions.
  UIViewController *parent = screenView.controller.parentViewController;
  if ([parent isKindOfClass:[UITabBarController class]]) {
    UITabBarController *tabBarVC = (UITabBarController *)parent;
    [tabBarVC.tabBar setNeedsLayout];
  }
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
