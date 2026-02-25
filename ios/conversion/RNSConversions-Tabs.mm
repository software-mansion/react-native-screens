#import <React/RCTConversions.h>
#import <cxxreact/ReactNativeVersion.h>
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
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabsHostTabBarMinimizeBehavior(
    react::RNSTabsHostTabBarMinimizeBehavior tabBarMinimizeBehavior)
{
  using enum facebook::react::RNSTabsHostTabBarMinimizeBehavior;

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

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(18.0))
UITabBarControllerMode UITabBarControllerModeFromRNSTabsHostTabBarControllerMode(
    react::RNSTabsHostTabBarControllerMode tabBarControllerMode)
{
  using enum facebook::react::RNSTabsHostTabBarControllerMode;

  switch (tabBarControllerMode) {
    case Automatic:
      return UITabBarControllerModeAutomatic;
    case TabBar:
      return UITabBarControllerModeTabBar;
    case TabSidebar:
      return UITabBarControllerModeTabSidebar;
    default:
      return UITabBarControllerModeAutomatic;
  }
}
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(18.0))
UITabBarControllerMode UITabBarControllerModeFromRNSTabBarControllerMode(RNSTabBarControllerMode tabBarDisplayMode)
{
  switch (tabBarDisplayMode) {
    case RNSTabBarControllerModeAutomatic:
      return UITabBarControllerModeAutomatic;
    case RNSTabBarControllerModeTabBar:
      return UITabBarControllerModeTabBar;
    case RNSTabBarControllerModeTabSidebar:
      return UITabBarControllerModeTabSidebar;
    default:
      return UITabBarControllerModeAutomatic;
  }
}
#endif // RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 18

RNSTabsIconType RNSTabsIconTypeFromIcon(react::RNSTabsScreenIconType iconType)
{
  using enum facebook::react::RNSTabsScreenIconType;
  switch (iconType) {
    case Image:
      return RNSTabsIconTypeImage;
    case Template:
      return RNSTabsIconTypeTemplate;
    case SfSymbol:
      return RNSTabsIconTypeSfSymbol;
    case Xcasset:
      return RNSTabsIconTypeXcasset;
  }
}

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSTabsIconType iconType)
{
  RCTImageSource *iconImageSource;

  switch (iconType) {
    case RNSTabsIconTypeSfSymbol:
      iconImageSource = nil;
      break;

    case RNSTabsIconTypeImage:
    case RNSTabsIconTypeTemplate:
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

RNSOrientation RNSOrientationFromRNSTabsScreenOrientation(react::RNSTabsScreenOrientation orientation)
{
  using enum facebook::react::RNSTabsScreenOrientation;

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

RNSTabsScreenSystemItem RNSTabsScreenSystemItemFromReactRNSTabsScreenSystemItem(
    react::RNSTabsScreenSystemItem systemItem)
{
  using enum facebook::react::RNSTabsScreenSystemItem;

  switch (systemItem) {
    case None:
      return RNSTabsScreenSystemItemNone;
    case Bookmarks:
      return RNSTabsScreenSystemItemBookmarks;
    case Contacts:
      return RNSTabsScreenSystemItemContacts;
    case Downloads:
      return RNSTabsScreenSystemItemDownloads;
    case Favorites:
      return RNSTabsScreenSystemItemFavorites;
    case Featured:
      return RNSTabsScreenSystemItemFeatured;
    case History:
      return RNSTabsScreenSystemItemHistory;
    case More:
      return RNSTabsScreenSystemItemMore;
    case MostRecent:
      return RNSTabsScreenSystemItemMostRecent;
    case MostViewed:
      return RNSTabsScreenSystemItemMostViewed;
    case Recents:
      return RNSTabsScreenSystemItemRecents;
    case Search:
      return RNSTabsScreenSystemItemSearch;
    case TopRated:
      return RNSTabsScreenSystemItemTopRated;
    default:
      RCTLogError(@"[RNScreens] unsupported tabs screen systemItem");
      return RNSTabsScreenSystemItemNone;
  }
}

UITabBarSystemItem RNSTabsScreenSystemItemToUITabBarSystemItem(RNSTabsScreenSystemItem systemItem)
{
  RCTAssert(
      systemItem != RNSTabsScreenSystemItemNone, @"Attempt to convert tabs systemItem none to UITabBarSystemItem");
  switch (systemItem) {
    case RNSTabsScreenSystemItemBookmarks:
      return UITabBarSystemItemBookmarks;
    case RNSTabsScreenSystemItemContacts:
      return UITabBarSystemItemContacts;
    case RNSTabsScreenSystemItemDownloads:
      return UITabBarSystemItemDownloads;
    case RNSTabsScreenSystemItemFavorites:
      return UITabBarSystemItemFavorites;
    case RNSTabsScreenSystemItemFeatured:
      return UITabBarSystemItemFeatured;
    case RNSTabsScreenSystemItemHistory:
      return UITabBarSystemItemHistory;
    case RNSTabsScreenSystemItemMore:
      return UITabBarSystemItemMore;
    case RNSTabsScreenSystemItemMostRecent:
      return UITabBarSystemItemMostRecent;
    case RNSTabsScreenSystemItemMostViewed:
      return UITabBarSystemItemMostViewed;
    case RNSTabsScreenSystemItemRecents:
      return UITabBarSystemItemRecents;
    case RNSTabsScreenSystemItemSearch:
      return UITabBarSystemItemSearch;
    case RNSTabsScreenSystemItemTopRated:
      return UITabBarSystemItemTopRated;
  }
  RCTAssert(true, @"Attempt to convert unknown tabs screen systemItem to UITabBarSystemItem [%d]", systemItem);
  return UITabBarSystemItemSearch;
}

#define SWITCH_EDGE_EFFECT(X)                              \
  switch (edgeEffect) {                                    \
    using enum react::X;                                   \
    case Automatic:                                        \
      return RNSScrollEdgeEffectAutomatic;                 \
    case Hard:                                             \
      return RNSScrollEdgeEffectHard;                      \
    case Soft:                                             \
      return RNSScrollEdgeEffectSoft;                      \
    case Hidden:                                           \
      return RNSScrollEdgeEffectHidden;                    \
    default:                                               \
      RCTLogError(@"[RNScreens] unsupported edge effect"); \
      return RNSScrollEdgeEffectAutomatic;                 \
  }

RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenBottomScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenBottomScrollEdgeEffect edgeEffect)
{
  SWITCH_EDGE_EFFECT(RNSTabsScreenBottomScrollEdgeEffect);
}

RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenLeftScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenLeftScrollEdgeEffect edgeEffect)
{
  SWITCH_EDGE_EFFECT(RNSTabsScreenLeftScrollEdgeEffect);
}

RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenRightScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenRightScrollEdgeEffect edgeEffect)
{
  SWITCH_EDGE_EFFECT(RNSTabsScreenRightScrollEdgeEffect);
}

RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenTopScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenTopScrollEdgeEffect edgeEffect)
{
  SWITCH_EDGE_EFFECT(RNSTabsScreenTopScrollEdgeEffect);
}

#undef SWITCH_EDGE_EFFECT

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
std::optional<react::RNSTabsBottomAccessoryEventEmitter::OnEnvironmentChangeEnvironment>
RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(UITabAccessoryEnvironment environment)
{
  switch (environment) {
    case UITabAccessoryEnvironmentRegular:
      return react::RNSTabsBottomAccessoryEventEmitter::OnEnvironmentChangeEnvironment::Regular;
    case UITabAccessoryEnvironmentInline:
      return react::RNSTabsBottomAccessoryEventEmitter::OnEnvironmentChangeEnvironment::Inline;
    default:
      // We want to ignore other environments (e.g. `none`), that's why there is no warning here.
      return std::nullopt;
  }
}

#if REACT_NATIVE_VERSION_MINOR >= 82
RNSTabsBottomAccessoryEnvironment RNSTabsBottomAccessoryEnvironmentFromCppEquivalent(
    react::RNSTabsBottomAccessoryContentEnvironment environment)
{
  using enum react::RNSTabsBottomAccessoryContentEnvironment;

  switch (environment) {
    case Regular:
      return RNSTabsBottomAccessoryEnvironmentRegular;

    case Inline:
      return RNSTabsBottomAccessoryEnvironmentInline;

    default:
      RCTLogError(@"[RNScreens] Unsupported TabsBottomAccessory environment");
  }
}
#endif // REACT_NATIVE_VERSION_MINOR >= 82

#else // RCT_NEW_ARCH_ENABLED
static NSString *const BOTTOM_TABS_ACCESSORY_REGULAR_ENVIRONMENT = @"regular";
static NSString *const BOTTOM_TABS_ACCESSORY_INLINE_ENVIRONMENT = @"inline";

API_AVAILABLE(ios(26.0))
NSString *RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(
    UITabAccessoryEnvironment environment)
{
  NSString *environmentString;
  switch (environment) {
    case UITabAccessoryEnvironmentRegular:
      environmentString = BOTTOM_TABS_ACCESSORY_REGULAR_ENVIRONMENT;
      break;
    case UITabAccessoryEnvironmentInline:
      environmentString = BOTTOM_TABS_ACCESSORY_INLINE_ENVIRONMENT;
      break;
    default:
      // We want to ignore other environments (e.g. `none`), that's why there is no warning here.
      environmentString = nil;
      break;
  }

  return environmentString;
}

#endif // RCT_NEW_ARCH_ENABLED

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

UIUserInterfaceStyle UIUserInterfaceStyleFromTabsScreenCppEquivalent(
    react::RNSTabsScreenUserInterfaceStyle userInterfaceStyle)
{
  using enum facebook::react::RNSTabsScreenUserInterfaceStyle;
  switch (userInterfaceStyle) {
    case Unspecified:
      return UIUserInterfaceStyleUnspecified;
    case Light:
      return UIUserInterfaceStyleLight;
    case Dark:
      return UIUserInterfaceStyleDark;
    default:
      RCTLogError(@"[RNScreens] unsupported user interface style");
  }
}

}; // namespace rnscreens::conversion
