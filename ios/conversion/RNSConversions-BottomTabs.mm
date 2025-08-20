#import <React/RCTConversions.h>
#import <react/renderer/imagemanager/RCTImagePrimitivesConversions.h>
#import "RNSConversions.h"

namespace rnscreens::conversion {

UIBlurEffect *RNSUIBlurEffectFromOptionalUIBlurEffectStyle(std::optional<UIBlurEffectStyle> &maybeStyle)
{
  if (maybeStyle) {
    return [UIBlurEffect effectWithStyle:maybeStyle.value()];
  }
  return nil;
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

RNSBlurEffectStyle RNSBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsTabBarBlurEffect;

  switch (blurEffect) {
    case None:
      return RNSBlurEffectStyleNone;
    case SystemDefault:
      return RNSBlurEffectStyleSystemDefault;
    case ExtraLight:
      return RNSBlurEffectStyleExtraLight;
    case Light:
      return RNSBlurEffectStyleLight;
    case Dark:
      return RNSBlurEffectStyleDark;
    case Regular:
      return RNSBlurEffectStyleRegular;
    case Prominent:
      return RNSBlurEffectStyleProminent;
#if !TARGET_OS_TV
    case SystemUltraThinMaterial:
      return RNSBlurEffectStyleSystemUltraThinMaterial;
    case SystemThinMaterial:
      return RNSBlurEffectStyleSystemThinMaterial;
    case SystemMaterial:
      return RNSBlurEffectStyleSystemMaterial;
    case SystemThickMaterial:
      return RNSBlurEffectStyleSystemThickMaterial;
    case SystemChromeMaterial:
      return RNSBlurEffectStyleSystemChromeMaterial;
    case SystemUltraThinMaterialLight:
      return RNSBlurEffectStyleSystemUltraThinMaterialLight;
    case SystemThinMaterialLight:
      return RNSBlurEffectStyleSystemThinMaterialLight;
    case SystemMaterialLight:
      return RNSBlurEffectStyleSystemMaterialLight;
    case SystemThickMaterialLight:
      return RNSBlurEffectStyleSystemThickMaterialLight;
    case SystemChromeMaterialLight:
      return RNSBlurEffectStyleSystemChromeMaterialLight;
    case SystemUltraThinMaterialDark:
      return RNSBlurEffectStyleSystemUltraThinMaterialDark;
    case SystemThinMaterialDark:
      return RNSBlurEffectStyleSystemThinMaterialDark;
    case SystemMaterialDark:
      return RNSBlurEffectStyleSystemMaterialDark;
    case SystemThickMaterialDark:
      return RNSBlurEffectStyleSystemThickMaterialDark;
    case SystemChromeMaterialDark:
      return RNSBlurEffectStyleSystemChromeMaterialDark;
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return RNSBlurEffectStyleNone;
#else // !TARGET_OS_TV
    default:
      return RNSBlurEffectStyleNone;
#endif
  }
}

UIOffset RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct titlePositionAdjustment)
{
  return UIOffsetMake(titlePositionAdjustment.horizontal, titlePositionAdjustment.vertical);
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
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

#if !RCT_NEW_ARCH_ENABLED
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
#endif // !RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 26

RNSBlurEffectStyle RNSBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsScreenTabBarBlurEffect;

  switch (blurEffect) {
    case None:
      return RNSBlurEffectStyleNone;
    case SystemDefault:
      return RNSBlurEffectStyleSystemDefault;
    case ExtraLight:
      return RNSBlurEffectStyleExtraLight;
    case Light:
      return RNSBlurEffectStyleLight;
    case Dark:
      return RNSBlurEffectStyleDark;
    case Regular:
      return RNSBlurEffectStyleRegular;
    case Prominent:
      return RNSBlurEffectStyleProminent;
#if !TARGET_OS_TV
    case SystemUltraThinMaterial:
      return RNSBlurEffectStyleSystemUltraThinMaterial;
    case SystemThinMaterial:
      return RNSBlurEffectStyleSystemThinMaterial;
    case SystemMaterial:
      return RNSBlurEffectStyleSystemMaterial;
    case SystemThickMaterial:
      return RNSBlurEffectStyleSystemThickMaterial;
    case SystemChromeMaterial:
      return RNSBlurEffectStyleSystemChromeMaterial;
    case SystemUltraThinMaterialLight:
      return RNSBlurEffectStyleSystemUltraThinMaterialLight;
    case SystemThinMaterialLight:
      return RNSBlurEffectStyleSystemThinMaterialLight;
    case SystemMaterialLight:
      return RNSBlurEffectStyleSystemMaterialLight;
    case SystemThickMaterialLight:
      return RNSBlurEffectStyleSystemThickMaterialLight;
    case SystemChromeMaterialLight:
      return RNSBlurEffectStyleSystemChromeMaterialLight;
    case SystemUltraThinMaterialDark:
      return RNSBlurEffectStyleSystemUltraThinMaterialDark;
    case SystemThinMaterialDark:
      return RNSBlurEffectStyleSystemThinMaterialDark;
    case SystemMaterialDark:
      return RNSBlurEffectStyleSystemMaterialDark;
    case SystemThickMaterialDark:
      return RNSBlurEffectStyleSystemThickMaterialDark;
    case SystemChromeMaterialDark:
      return RNSBlurEffectStyleSystemChromeMaterialDark;
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return RNSBlurEffectStyleNone;
#else // !TARGET_OS_TV
    default:
      return RNSBlurEffectStyleNone;
#endif
  }
}

UIOffset RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct titlePositionAdjustment)
{
  return UIOffsetMake(titlePositionAdjustment.horizontal, titlePositionAdjustment.vertical);
}

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
