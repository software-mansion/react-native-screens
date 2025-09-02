#import <React/RCTConversions.h>
#import <react/renderer/imagemanager/RCTImagePrimitivesConversions.h>
#import "RNSConversions.h"
#import "RNSDefines.h"

namespace rnscreens::conversion {

UIBlurEffect *RNSUIBlurEffectFromOptionalUIBlurEffectStyle(std::optional<UIBlurEffectStyle> &maybeStyle)
{
  if (maybeStyle) {
    return [UIBlurEffect effectWithStyle:maybeStyle.value()];
  }
  return nil;
}

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromString(NSString *blurEffectString)
{
  if ([blurEffectString isEqualToString:@"none"] || [blurEffectString isEqualToString:@"systemDefault"]) {
    return std::nullopt;
  } else if ([blurEffectString isEqualToString:@"extraLight"]) {
    return {UIBlurEffectStyleExtraLight};
  } else if ([blurEffectString isEqualToString:@"light"]) {
    return {UIBlurEffectStyleLight};
  } else if ([blurEffectString isEqualToString:@"dark"]) {
    return {UIBlurEffectStyleDark};
  } else if ([blurEffectString isEqualToString:@"regular"]) {
    return {UIBlurEffectStyleRegular};
  } else if ([blurEffectString isEqualToString:@"prominent"]) {
    return {UIBlurEffectStyleProminent};
  }
#if !TARGET_OS_TV
  else if ([blurEffectString isEqualToString:@"systemUltraThinMaterial"]) {
    return {UIBlurEffectStyleSystemUltraThinMaterial};
  } else if ([blurEffectString isEqualToString:@"systemThinMaterial"]) {
    return {UIBlurEffectStyleSystemThinMaterial};
  } else if ([blurEffectString isEqualToString:@"systemMaterial"]) {
    return {UIBlurEffectStyleSystemMaterial};
  } else if ([blurEffectString isEqualToString:@"systemThickMaterial"]) {
    return {UIBlurEffectStyleSystemThickMaterial};
  } else if ([blurEffectString isEqualToString:@"systemChromeMaterial"]) {
    return {UIBlurEffectStyleSystemChromeMaterial};
  } else if ([blurEffectString isEqualToString:@"systemUltraThinMaterialLight"]) {
    return {UIBlurEffectStyleSystemUltraThinMaterialLight};
  } else if ([blurEffectString isEqualToString:@"systemThinMaterialLight"]) {
    return {UIBlurEffectStyleSystemThinMaterialLight};
  } else if ([blurEffectString isEqualToString:@"systemMaterialLight"]) {
    return {UIBlurEffectStyleSystemMaterialLight};
  } else if ([blurEffectString isEqualToString:@"systemThickMaterialLight"]) {
    return {UIBlurEffectStyleSystemThickMaterialLight};
  } else if ([blurEffectString isEqualToString:@"systemChromeMaterialLight"]) {
    return {UIBlurEffectStyleSystemChromeMaterialLight};
  } else if ([blurEffectString isEqualToString:@"systemUltraThinMaterialDark"]) {
    return {UIBlurEffectStyleSystemUltraThinMaterialDark};
  } else if ([blurEffectString isEqualToString:@"systemThinMaterialDark"]) {
    return {UIBlurEffectStyleSystemThinMaterialDark};
  } else if ([blurEffectString isEqualToString:@"systemMaterialDark"]) {
    return {UIBlurEffectStyleSystemMaterialDark};
  } else if ([blurEffectString isEqualToString:@"systemThickMaterialDark"]) {
    return {UIBlurEffectStyleSystemThickMaterialDark};
  } else if ([blurEffectString isEqualToString:@"systemChromeMaterialDark"]) {
    return {UIBlurEffectStyleSystemChromeMaterialDark};
  }
#endif // !TARGET_OS_TV
  else {
#if !TARGET_OS_TV
    RCTLogError(@"[RNScreens] Unsupported blur effect style: %@", blurEffectString);
#endif // !TARGET_OS_TV
    return std::nullopt;
  }
}

UIBlurEffect *RNSUIBlurEffectFromString(NSString *blurEffectString)
{
  std::optional<UIBlurEffectStyle> maybeStyle = RNSMaybeUIBlurEffectStyleFromString(blurEffectString);
  return RNSUIBlurEffectFromOptionalUIBlurEffectStyle(maybeStyle);
}

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect)
{
  switch (blurEffect) {
    case RNSBlurEffectStyleNone:
    case RNSBlurEffectStyleSystemDefault:
      return std::nullopt;
    case RNSBlurEffectStyleExtraLight:
      return {UIBlurEffectStyleExtraLight};
    case RNSBlurEffectStyleLight:
      return {UIBlurEffectStyleLight};
    case RNSBlurEffectStyleDark:
      return {UIBlurEffectStyleDark};
    case RNSBlurEffectStyleRegular:
      return {UIBlurEffectStyleRegular};
    case RNSBlurEffectStyleProminent:
      return {UIBlurEffectStyleProminent};
#if !TARGET_OS_TV
    case RNSBlurEffectStyleSystemUltraThinMaterial:
      return {UIBlurEffectStyleSystemUltraThinMaterial};
    case RNSBlurEffectStyleSystemThinMaterial:
      return {UIBlurEffectStyleSystemThinMaterial};
    case RNSBlurEffectStyleSystemMaterial:
      return {UIBlurEffectStyleSystemMaterial};
    case RNSBlurEffectStyleSystemThickMaterial:
      return {UIBlurEffectStyleSystemThickMaterial};
    case RNSBlurEffectStyleSystemChromeMaterial:
      return {UIBlurEffectStyleSystemChromeMaterial};
    case RNSBlurEffectStyleSystemUltraThinMaterialLight:
      return {UIBlurEffectStyleSystemUltraThinMaterialLight};
    case RNSBlurEffectStyleSystemThinMaterialLight:
      return {UIBlurEffectStyleSystemThinMaterialLight};
    case RNSBlurEffectStyleSystemMaterialLight:
      return {UIBlurEffectStyleSystemMaterialLight};
    case RNSBlurEffectStyleSystemThickMaterialLight:
      return {UIBlurEffectStyleSystemThickMaterialLight};
    case RNSBlurEffectStyleSystemChromeMaterialLight:
      return {UIBlurEffectStyleSystemChromeMaterialLight};
    case RNSBlurEffectStyleSystemUltraThinMaterialDark:
      return {UIBlurEffectStyleSystemUltraThinMaterialDark};
    case RNSBlurEffectStyleSystemThinMaterialDark:
      return {UIBlurEffectStyleSystemThinMaterialDark};
    case RNSBlurEffectStyleSystemMaterialDark:
      return {UIBlurEffectStyleSystemMaterialDark};
    case RNSBlurEffectStyleSystemThickMaterialDark:
      return {UIBlurEffectStyleSystemThickMaterialDark};
    case RNSBlurEffectStyleSystemChromeMaterialDark:
      return {UIBlurEffectStyleSystemChromeMaterialDark};
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return std::nullopt;
#else // !TARGET_OS_TV
    default:
      return std::nullopt;
#endif // !TARGET_OS_TV
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle = RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(blurEffect);
  return RNSUIBlurEffectFromOptionalUIBlurEffectStyle(maybeStyle);
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSBottomTabsTabBarMinimizeBehavior(
    react::RNSBottomTabsTabBarMinimizeBehavior tabBarMinimizeBehavior)
{
  using enum facebook::react::RNSBottomTabsTabBarMinimizeBehavior;

  switch (tabBarMinimizeBehavior) {
    case Never:
      return UITabBarMinimizeBehaviorNever;
    case OnScrollDown:
      return UITabBarMinimizeBehaviorOnScrollDown;
    case OnScrollUp:
      return UITabBarMinimizeBehaviorOnScrollUp;
    default:
      return UITabBarMinimizeBehaviorAutomatic;
  }
}
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior(
    RNSTabBarMinimizeBehavior tabBarMinimizeBehavior)
{
  switch (tabBarMinimizeBehavior) {
    case RNSTabBarMinimizeBehaviorNever:
      return UITabBarMinimizeBehaviorNever;
    case RNSTabBarMinimizeBehaviorOnScrollDown:
      return UITabBarMinimizeBehaviorOnScrollDown;
    case RNSTabBarMinimizeBehaviorOnScrollUp:
      return UITabBarMinimizeBehaviorOnScrollUp;
    default:
      return UITabBarMinimizeBehaviorAutomatic;
  }
}
#endif // RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 26

RNSBottomTabsIconType RNSBottomTabsIconTypeFromIcon(react::RNSBottomTabsScreenIconType iconType)
{
  using enum facebook::react::RNSBottomTabsScreenIconType;
  switch (iconType) {
    case Image:
      return RNSBottomTabsIconTypeImage;
    case Template:
      return RNSBottomTabsIconTypeTemplate;
    case SfSymbol:
      return RNSBottomTabsIconTypeSfSymbol;
  }
}

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSBottomTabsIconType iconType)
{
  RCTImageSource *iconImageSource;

  switch (iconType) {
    case RNSBottomTabsIconTypeSfSymbol:
      iconImageSource = nil;
      break;

    case RNSBottomTabsIconTypeImage:
    case RNSBottomTabsIconTypeTemplate:
      iconImageSource =
          [[RCTImageSource alloc] initWithURLRequest:NSURLRequestFromImageSource(*imageSource)
                                                size:CGSizeMake(imageSource->size.width, imageSource->size.height)
                                               scale:imageSource->scale];
      break;

    default:
      RCTLogError(@"[RNScreens] unsupported icon type");
  }

  return iconImageSource;
}

RNSOrientation RNSOrientationFromRNSBottomTabsScreenOrientation(react::RNSBottomTabsScreenOrientation orientation)
{
  using enum facebook::react::RNSBottomTabsScreenOrientation;

  switch (orientation) {
    case Inherit:
      return RNSOrientationInherit;
    case All:
      return RNSOrientationAll;
    case AllButUpsideDown:
      return RNSOrientationAllButUpsideDown;
    case Portrait:
      return RNSOrientationPortrait;
    case PortraitUp:
      return RNSOrientationPortraitUp;
    case PortraitDown:
      return RNSOrientationPortraitDown;
    case Landscape:
      return RNSOrientationLandscape;
    case LandscapeLeft:
      return RNSOrientationLandscapeLeft;
    case LandscapeRight:
      return RNSOrientationLandscapeRight;
    default:
      RCTLogError(@"[RNScreens] unsupported orientation");
      return RNSOrientationInherit;
  }
}

RNSBottomTabsScreenSystemItem RNSBottomTabsScreenSystemItemFromReactRNSBottomTabsScreenSystemItem(
    react::RNSBottomTabsScreenSystemItem systemItem)
{
  using enum facebook::react::RNSBottomTabsScreenSystemItem;

  switch (systemItem) {
    case None:
      return RNSBottomTabsScreenSystemItemNone;
    case Bookmarks:
      return RNSBottomTabsScreenSystemItemBookmarks;
    case Contacts:
      return RNSBottomTabsScreenSystemItemContacts;
    case Downloads:
      return RNSBottomTabsScreenSystemItemDownloads;
    case Favorites:
      return RNSBottomTabsScreenSystemItemFavorites;
    case Featured:
      return RNSBottomTabsScreenSystemItemFeatured;
    case History:
      return RNSBottomTabsScreenSystemItemHistory;
    case More:
      return RNSBottomTabsScreenSystemItemMore;
    case MostRecent:
      return RNSBottomTabsScreenSystemItemMostRecent;
    case MostViewed:
      return RNSBottomTabsScreenSystemItemMostViewed;
    case Recents:
      return RNSBottomTabsScreenSystemItemRecents;
    case Search:
      return RNSBottomTabsScreenSystemItemSearch;
    case TopRated:
      return RNSBottomTabsScreenSystemItemTopRated;
    default:
      RCTLogError(@"[RNScreens] unsupported bottom tabs screen systemItem");
      return RNSBottomTabsScreenSystemItemNone;
  }
}

UITabBarSystemItem RNSBottomTabsScreenSystemItemToUITabBarSystemItem(RNSBottomTabsScreenSystemItem systemItem)
{
  RCTAssert(
      systemItem != RNSBottomTabsScreenSystemItemNone,
      @"Attempt to convert bottom tabs systemItem none to UITabBarSystemItem");
  switch (systemItem) {
    case RNSBottomTabsScreenSystemItemBookmarks:
      return UITabBarSystemItemBookmarks;
    case RNSBottomTabsScreenSystemItemContacts:
      return UITabBarSystemItemContacts;
    case RNSBottomTabsScreenSystemItemDownloads:
      return UITabBarSystemItemDownloads;
    case RNSBottomTabsScreenSystemItemFavorites:
      return UITabBarSystemItemFavorites;
    case RNSBottomTabsScreenSystemItemFeatured:
      return UITabBarSystemItemFeatured;
    case RNSBottomTabsScreenSystemItemHistory:
      return UITabBarSystemItemHistory;
    case RNSBottomTabsScreenSystemItemMore:
      return UITabBarSystemItemMore;
    case RNSBottomTabsScreenSystemItemMostRecent:
      return UITabBarSystemItemMostRecent;
    case RNSBottomTabsScreenSystemItemMostViewed:
      return UITabBarSystemItemMostViewed;
    case RNSBottomTabsScreenSystemItemRecents:
      return UITabBarSystemItemRecents;
    case RNSBottomTabsScreenSystemItemSearch:
      return UITabBarSystemItemSearch;
    case RNSBottomTabsScreenSystemItemTopRated:
      return UITabBarSystemItemTopRated;
  }
  RCTAssert(true, @"Attempt to convert unknown bottom tabs screen systemItem to UITabBarSystemItem [%d]", systemItem);
  return UITabBarSystemItemSearch;
}

}; // namespace rnscreens::conversion
