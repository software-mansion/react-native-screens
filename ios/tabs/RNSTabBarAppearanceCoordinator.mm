#import "RNSTabBarAppearanceCoordinator.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSTabBarItemCoordinator.h"
#import "RNSTabsScreenViewController.h"

/// Loads a symbol image by name: a built-in SF Symbol if one matches, otherwise a custom symbol from the app's asset
/// catalog (custom symbols are semantically SF Symbols, but UIKit only resolves them via `imageNamed:`).
static UIImage *_Nullable RNSSymbolImageNamed(NSString *name)
{
  UIImage *image = [UIImage systemImageNamed:name];
  if (image == nil) {
    image = [UIImage imageNamed:name];
  }
  return image;
}

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

- (void)updateAppearanceOfTabBarController:(nonnull UITabBarController *)tabBarController
                             withTintColor:(nullable UIColor *)tintColor
                      tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                               imageLoader:(nullable id<RNSImageLoading>)imageLoader
{
  UITabBar *tabBar = tabBarController.tabBar;
  if (tabBar == nil) {
    return;
  }

  // Step 1 - configure host-specific appearance
  tabBar.tintColor = tintColor;

  // Set tint color for iPadOS tab bar. This is the official way recommended by Apple:
  // https://developer.apple.com/forums/thread/761056?answerId=798245022#798245022
  tabBarController.view.tintColor = tintColor;

  if (tabScreenCtrls == nil) {
    return;
  }

  // Step 2 - configure screen-specific appearance
  for (RNSTabsScreenViewController *tabScreenCtrl in tabScreenCtrls) {
    if (tabScreenCtrl == nil) {
      // It should not be null here, something went wrong.
      RNSLogW(@"[RNScreens] Nullish controller of TabScreen while tab bar appearance update!");
      continue;
    }

    [self configureTabBarItemForTabScreenController:tabScreenCtrl imageLoader:imageLoader];
  }
}

- (void)configureTabBarItemForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
                                      imageLoader:(nullable id<RNSImageLoading>)imageLoader
{
  UITabBarItem *tabBarItem = tabScreenCtrl.tabBarItem;
  UIView<RNSTabsContainerItemConfigProviding> *screenView = tabScreenCtrl.configProvider;

  tabBarItem.standardAppearance = screenView.standardAppearance;
  tabBarItem.scrollEdgeAppearance = screenView.scrollEdgeAppearance;

  [self setIconsForTabBarItem:tabBarItem forTabScreenController:tabScreenCtrl withImageLoader:imageLoader];
}

/// Sets the normal icon on both the item (renders the iPhone bar) and the UITab (renders the
/// iPad floating bar / sidebar, which never reads the item).
- (void)setTabImage:(nullable UIImage *)image
          forTabBarItem:(nonnull UITabBarItem *)tabBarItem
    tabScreenController:(nullable RNSTabsScreenViewController *)tabScreenCtrl
{
#if RNS_UITAB_API_SDK_AVAILABLE
  if (RNS_UITAB_API_ENABLED) {
    tabScreenCtrl.tab.image = image;
  }
#endif // RNS_UITAB_API_SDK_AVAILABLE
  // This needs to be called after tab.image assignment
  // (see https://github.com/software-mansion/react-native-screens/pull/4813)
  tabBarItem.image = image;
}

- (void)setIconsForTabBarItem:(UITabBarItem *)tabBarItem
       forTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl
              withImageLoader:(nullable id<RNSImageLoading>)imageLoader
{
  UIView<RNSTabsContainerItemConfigProviding> *screenView = tabScreenCtrl.configProvider;

  if (screenView.iconType == RNSTabsIconTypeSfSymbol) {
    if (screenView.iconResourceName != nil) {
      UIImage *image = RNSSymbolImageNamed(screenView.iconResourceName);
      if (image == nil) {
        RNSLogW(@"[RNScreens] Failed to load SF Symbol \"%@\" for tab bar item", screenView.iconResourceName);
      }
      [self setTabImage:RNSImageWithSymbolRenderingMode(image, screenView.iconSymbolRenderingMode)
                forTabBarItem:tabBarItem
          tabScreenController:tabScreenCtrl];
    } else if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarItem *systemTabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
      if (systemTabBarItem == nil) {
        RNSLogE(@"[RNScreens] No system tab bar item for tabs screen systemItem [%ld]", (long)screenView.systemItem);
        return;
      }
      UIImage *_Nullable systemItemImage = systemTabBarItem.image;
      [self setTabImage:systemItemImage forTabBarItem:tabBarItem tabScreenController:tabScreenCtrl];
    } else {
      [self setTabImage:nil forTabBarItem:tabBarItem tabScreenController:tabScreenCtrl];
    }

    if (screenView.selectedIconResourceName != nil) {
      UIImage *selectedImage = RNSSymbolImageNamed(screenView.selectedIconResourceName);
      if (selectedImage == nil) {
        RNSLogW(@"[RNScreens] Failed to load SF Symbol \"%@\" for selected tab bar item",
                screenView.selectedIconResourceName);
      }
      tabBarItem.selectedImage =
          RNSImageWithSymbolRenderingMode(selectedImage, screenView.selectedIconSymbolRenderingMode);
    } else if (screenView.systemItem != RNSTabsScreenSystemItemNone) {
      // Restore default system item icon
      UITabBarItem *systemTabBarItem = [RNSTabBarItemCoordinator tabBarItemWithSystemItem:screenView.systemItem];
      if (systemTabBarItem == nil) {
        RNSLogE(@"[RNScreens] No system tab bar item for tabs screen systemItem [%ld]", (long)screenView.systemItem);
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
    __weak RNSTabsScreenViewController *weakTabScreenCtrl = tabScreenCtrl;

    // Normal icon
    if (screenView.iconImageSource != nil) {
      [imageLoader loadImageFromSource:screenView.iconImageSource
                            asTemplate:isTemplate
                withCompletionCallback:^(UIImage *image) {
                  [self updateTabBarItem:weakTabBarItem
                                   withImage:RNSImageWithImageRenderingMode(image, iconRenderingMode)
                                  isSelected:NO
                      forTabScreenController:weakTabScreenCtrl];
                }];
    } else {
      [self setTabImage:nil forTabBarItem:tabBarItem tabScreenController:tabScreenCtrl];
    }

    // Selected icon
    if (screenView.selectedIconImageSource != nil) {
      [imageLoader loadImageFromSource:screenView.selectedIconImageSource
                            asTemplate:isSelectedTemplate
                withCompletionCallback:^(UIImage *image) {
                  [self updateTabBarItem:weakTabBarItem
                                   withImage:RNSImageWithImageRenderingMode(image, selectedIconRenderingMode)
                                  isSelected:YES
                      forTabScreenController:weakTabScreenCtrl];
                }];
    } else {
      tabBarItem.selectedImage = nil;
    }
  } else {
    RNSLogW(@"[RNScreens] unable to load tab bar item icons: imageLoader should not be nil");
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
    forTabScreenController:(nullable RNSTabsScreenViewController *)tabScreenCtrl
{
  // This method is sometimes called from an asynchronous context and we got reports
  // that on iOS 26+ it can happen that the tab bar item is already nullish, or the
  // screen's controller is not attached to the UITabBarController.
  if (tabBarItem == nil || tabScreenCtrl == nil) {
    return;
  }

  if (![self isScreenControllerAttachedToTabBarController:tabScreenCtrl]) {
    return;
  }

  if (isSelected) {
    tabBarItem.selectedImage = image;
  } else {
    [self setTabImage:image forTabBarItem:tabBarItem tabScreenController:tabScreenCtrl];
  }

  UIViewController *screenParentViewController = [tabScreenCtrl parentViewController];
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

@end
