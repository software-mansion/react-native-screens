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

}; // namespace rnscreens::conversion
