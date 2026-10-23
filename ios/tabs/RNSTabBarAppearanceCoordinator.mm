#import "RNSTabBarAppearanceCoordinator.h"
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import <React/RCTLog.h>
#import "RCTConvert+RNSTabs.h"
#import "RNSConversions-Tabs.h"
#import "RNSDefines.h"
#import "RNSImageLoadingHelper.h"
#import "RNSTabBarController.h"
#import "RNSTabBarItemCoordinator.h"
#import "RNSTabsHostComponentView.h"
#import "RNSTabsScreenComponentView.h"
#import "RNSTabsScreenViewController.h"

static UIImage *_Nullable RNSImageWithSymbolRenderingMode(UIImage *_Nullable image,
                                                          RNSTabsIconSymbolRenderingMode renderingMode)
{
  switch (renderingMode) {
    case RNSTabsIconSymbolRenderingModeMonochrome:
      return [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    case RNSTabsIconSymbolRenderingModeOriginal:
      return [image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
    case RNSTabsIconSymbolRenderingModeDefault:
    default:
      return image;
  }
}

static UIImage *_Nullable RNSImageWithImageRenderingMode(UIImage *_Nullable image,
                                                         RNSTabsIconImageRenderingMode renderingMode)
{
  switch (renderingMode) {
    case RNSTabsIconImageRenderingModeTemplate:
      return [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    case RNSTabsIconImageRenderingModeOriginal:
      return [image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
    case RNSTabsIconImageRenderingModeDefault:
    default:
      return [image imageWithRenderingMode:UIImageRenderingModeAutomatic];
  }
}

@implementation RNSTabBarAppearanceCoordinator

- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSTabsHostComponentView *)hostComponentView
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
  auto *screenView = static_cast<RNSTabsScreenComponentView *>(tabScreenCtrl.view);

  tabBarItem.standardAppearance = screenView.standardAppearance;
  tabBarItem.scrollEdgeAppearance = screenView.scrollEdgeAppearance;

  [self setIconsForTabBarItem:tabBarItem fromScreenView:screenView withImageLoader:imageLoader];
}

/// Sets the normal icon on both the item (renders the iPhone bar) and the UITab (renders the
/// iPad floating bar / sidebar, which never reads the item).
- (void)setTabImage:(nullable UIImage *)image
      forTabBarItem:(nonnull UITabBarItem *)tabBarItem
         screenView:(nullable RNSTabsScreenComponentView *)screenView
{
#if RNS_UITAB_API_SDK_AVAILABLE
  if (RNS_UITAB_API_ENABLED) {
    screenView.controller.tab.image = image;
  }
#endif // RNS_UITAB_API_SDK_AVAILABLE
  // This needs to be called after tab.image assignment
  // (see https://github.com/software-mansion/react-native-screens/pull/4813)
  tabBarItem.image = image;
}

- (void)setIconsForTabBarItem:(UITabBarItem *)tabBarItem
               fromScreenView:(RNSTabsScreenComponentView *)screenView
              withImageLoader:(RCTImageLoader *_Nullable)imageLoader
{
  if (screenView.iconType == RNSTabsIconTypeSfSymbol) {
    if (screenView.iconResourceName != nil) {
      UIImage *image = [RNSImageLoadingHelper symbolImageNamed:screenView.iconResourceName];
      if (image == nil) {
        RCTLogWarn(@"[RNScreens] Failed to load SF Symbol \"%@\" for tab bar item", screenView.iconResourceName);
      }
      [self setTabImage:RNSImageWithSymbolRenderingMode(image, screenView.iconSymbolRenderingMode)
          forTabBarItem:tabBarItem
             screenView:screenView];
    } else if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarItem *systemTabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
      if (systemTabBarItem == nil) {
        RCTLogError(
            @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
            (long)screenView.systemItem);
        return;
      }
      UIImage *_Nullable systemItemImage = systemTabBarItem.image;
      [self setTabImage:systemItemImage forTabBarItem:tabBarItem screenView:screenView];
    } else {
      [self setTabImage:nil forTabBarItem:tabBarItem screenView:screenView];
    }

    if (screenView.selectedIconResourceName != nil) {
      UIImage *selectedImage = [RNSImageLoadingHelper symbolImageNamed:screenView.selectedIconResourceName];
      if (selectedImage == nil) {
        RCTLogWarn(@"[RNScreens] Failed to load SF Symbol \"%@\" for selected tab bar item",
                   screenView.selectedIconResourceName);
      }
      tabBarItem.selectedImage =
          RNSImageWithSymbolRenderingMode(selectedImage, screenView.selectedIconSymbolRenderingMode);
    } else if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarItem *systemTabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
      if (systemTabBarItem == nil) {
        RCTLogError(
            @"[RNScreens] Conversion from tabs screen systemItem to UITabBarSystemItem failed for systemItem [%ld]",
            (long)screenView.systemItem);
        return;
      }
      tabBarItem.selectedImage = systemTabBarItem.selectedImage;
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else if (imageLoader != nil) {
    RNSTabsIconImageRenderingMode iconRenderingMode = screenView.iconImageRenderingMode;
    RNSTabsIconImageRenderingMode selectedIconRenderingMode = screenView.selectedIconImageRenderingMode;
    bool isTemplate = iconRenderingMode == RNSTabsIconImageRenderingModeTemplate;
    bool isSelectedTemplate = selectedIconRenderingMode == RNSTabsIconImageRenderingModeTemplate;

    // Weak-capture to avoid updating a tab bar item whose internal
    // view hierarchy has been torn down (iOS 26 UIKit regression:
    // unowned refs inside UITabBarItem._updateViewAndPositionItems:).
    __weak UITabBarItem *weakTabBarItem = tabBarItem;
    __weak RNSTabsScreenComponentView *weakScreenView = screenView;

    // Normal icon
    if (screenView.iconImageSource != nil) {
      [RNSImageLoadingHelper loadImageFromSource:screenView.iconImageSource
                                 withImageLoader:imageLoader
                                      asTemplate:isTemplate
                                 completionBlock:^(UIImage *image) {
                                   [self updateTabBarItem:weakTabBarItem
                                                withImage:RNSImageWithImageRenderingMode(image, iconRenderingMode)
                                               isSelected:NO
                                            forScreenView:weakScreenView];
                                 }];
    } else {
      [self setTabImage:nil forTabBarItem:tabBarItem screenView:screenView];
    }

    // Selected icon
    if (screenView.selectedIconImageSource != nil) {
      [RNSImageLoadingHelper loadImageFromSource:screenView.selectedIconImageSource
                                 withImageLoader:imageLoader
                                      asTemplate:isSelectedTemplate
                                 completionBlock:^(UIImage *image) {
                                   [self
                                       updateTabBarItem:weakTabBarItem
                                              withImage:RNSImageWithImageRenderingMode(image, selectedIconRenderingMode)
                                             isSelected:YES
                                          forScreenView:weakScreenView];
                                 }];
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else {
    RCTLogWarn(@"[RNScreens] unable to load tab bar item icons: imageLoader should not be nil");
  }
}

/// Whether the screen is still managed by a tab bar controller. On the UITab path the controller of
/// a tab that overflows into More has no parent until the tab is first shown (UIKit parents it
/// lazily), but its `UITab` is installed - the tab is the liveness check there, not the parent.
- (BOOL)isScreenControllerAttachedToTabBarController:(nullable RNSTabsScreenViewController *)screenController
{
  if (screenController == nil) {
    return NO;
  }
#if RNS_UITAB_API_SDK_AVAILABLE
  if (RNS_UITAB_API_ENABLED) {
    return screenController.tab.tabBarController != nil;
  }
#endif // RNS_UITAB_API_SDK_AVAILABLE
  return screenController.parentViewController != nil;
}

- (void)updateTabBarItem:(nullable UITabBarItem *)tabBarItem
               withImage:(nullable UIImage *)image
              isSelected:(BOOL)isSelected
           forScreenView:(nullable RNSTabsScreenComponentView *)screenView
{
  // This method is sometimes called from an asynchronous context and we got reports
  // that on iOS 26+ it can happen that the tab bar item is already nullish, or the
  // screen's controller is not attached to the UITabBarController.
  if (tabBarItem == nil || screenView == nil) {
    return;
  }

  if (![self isScreenControllerAttachedToTabBarController:screenView.controller]) {
    return;
  }

  if (isSelected) {
    tabBarItem.selectedImage = image;
  } else {
    [self setTabImage:image forTabBarItem:tabBarItem screenView:screenView];
  }

  UIViewController *screenParentViewController = [screenView.controller parentViewController];
#if RNS_UITAB_API_SDK_AVAILABLE
  if (RNS_UITAB_API_ENABLED) {
    if (screenParentViewController == nil) {
      // A tab that overflows into More and has not been shown yet - UIKit parents it lazily. Its
      // icon lives in the More list, not in the bar, so there is nothing to lay out.
      return;
    }
  }
#endif // RNS_UITAB_API_SDK_AVAILABLE

  // A layout pass is required because the image might be loaded asynchronously,
  // after the tab bar has already been attached to the window.
  // This code handles case where image passed by the user is not
  // of appropriate size & needs to be readjusted. W/o additional
  // layout here the icon would be displayed with original dimensions.
  if ([screenParentViewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController *tabBarVC = (UITabBarController *)screenParentViewController;
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
