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

#if !RCT_NEW_ARCH_ENABLED
std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect)
{
  switch (blurEffect) {
    case RNSBlurEffectStyleNone:
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
#endif // !RCT_NEW_ARCH_ENABLED

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsTabBarBlurEffect;

  switch (blurEffect) {
    case None:
      return std::nullopt;
    case ExtraLight:
      return {UIBlurEffectStyleExtraLight};
    case Light:
      return {UIBlurEffectStyleLight};
    case Dark:
      return {UIBlurEffectStyleDark};
    case Regular:
      return {UIBlurEffectStyleRegular};
    case Prominent:
      return {UIBlurEffectStyleProminent};
#if !TARGET_OS_TV
    case SystemUltraThinMaterial:
      return {UIBlurEffectStyleSystemUltraThinMaterial};
    case SystemThinMaterial:
      return {UIBlurEffectStyleSystemThinMaterial};
    case SystemMaterial:
      return {UIBlurEffectStyleSystemMaterial};
    case SystemThickMaterial:
      return {UIBlurEffectStyleSystemThickMaterial};
    case SystemChromeMaterial:
      return {UIBlurEffectStyleSystemChromeMaterial};
    case SystemUltraThinMaterialLight:
      return {UIBlurEffectStyleSystemUltraThinMaterialLight};
    case SystemThinMaterialLight:
      return {UIBlurEffectStyleSystemThinMaterialLight};
    case SystemMaterialLight:
      return {UIBlurEffectStyleSystemMaterialLight};
    case SystemThickMaterialLight:
      return {UIBlurEffectStyleSystemThickMaterialLight};
    case SystemChromeMaterialLight:
      return {UIBlurEffectStyleSystemChromeMaterialLight};
    case SystemUltraThinMaterialDark:
      return {UIBlurEffectStyleSystemUltraThinMaterialDark};
    case SystemThinMaterialDark:
      return {UIBlurEffectStyleSystemThinMaterialDark};
    case SystemMaterialDark:
      return {UIBlurEffectStyleSystemMaterialDark};
    case SystemThickMaterialDark:
      return {UIBlurEffectStyleSystemThickMaterialDark};
    case SystemChromeMaterialDark:
      return {UIBlurEffectStyleSystemChromeMaterialDark};
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return std::nullopt;
#else // !TARGET_OS_TV
    default:
      return std::nullopt;
#endif
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsTabBarBlurEffect(react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle = RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(blurEffect);
  return RNSUIBlurEffectFromOptionalUIBlurEffectStyle(maybeStyle);
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

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsScreenTabBarBlurEffect;

  switch (blurEffect) {
    case None:
      return std::nullopt;
    case ExtraLight:
      return {UIBlurEffectStyleExtraLight};
    case Light:
      return {UIBlurEffectStyleLight};
    case Dark:
      return {UIBlurEffectStyleDark};
    case Regular:
      return {UIBlurEffectStyleRegular};
    case Prominent:
      return {UIBlurEffectStyleProminent};
#if !TARGET_OS_TV
    case SystemUltraThinMaterial:
      return {UIBlurEffectStyleSystemUltraThinMaterial};
    case SystemThinMaterial:
      return {UIBlurEffectStyleSystemThinMaterial};
    case SystemMaterial:
      return {UIBlurEffectStyleSystemMaterial};
    case SystemThickMaterial:
      return {UIBlurEffectStyleSystemThickMaterial};
    case SystemChromeMaterial:
      return {UIBlurEffectStyleSystemChromeMaterial};
    case SystemUltraThinMaterialLight:
      return {UIBlurEffectStyleSystemUltraThinMaterialLight};
    case SystemThinMaterialLight:
      return {UIBlurEffectStyleSystemThinMaterialLight};
    case SystemMaterialLight:
      return {UIBlurEffectStyleSystemMaterialLight};
    case SystemThickMaterialLight:
      return {UIBlurEffectStyleSystemThickMaterialLight};
    case SystemChromeMaterialLight:
      return {UIBlurEffectStyleSystemChromeMaterialLight};
    case SystemUltraThinMaterialDark:
      return {UIBlurEffectStyleSystemUltraThinMaterialDark};
    case SystemThinMaterialDark:
      return {UIBlurEffectStyleSystemThinMaterialDark};
    case SystemMaterialDark:
      return {UIBlurEffectStyleSystemMaterialDark};
    case SystemThickMaterialDark:
      return {UIBlurEffectStyleSystemThickMaterialDark};
    case SystemChromeMaterialDark:
      return {UIBlurEffectStyleSystemChromeMaterialDark};
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return std::nullopt;
#else // !TARGET_OS_TV
    default:
      return std::nullopt;
#endif
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle =
      RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(blurEffect);
  return RNSUIBlurEffectFromOptionalUIBlurEffectStyle(maybeStyle);
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
