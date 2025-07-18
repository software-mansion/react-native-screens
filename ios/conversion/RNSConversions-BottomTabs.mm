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

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSExtendedBlurEffectStyle(
    RNSExtendedBlurEffectStyle blurEffect)
{
#if !TARGET_OS_TV
  switch (blurEffect) {
    case RNSExtendedBlurEffectStyleNone:
    case RNSExtendedBlurEffectStyleDefault:
      return std::nullopt;
    case RNSExtendedBlurEffectStyleExtraLight:
      return {UIBlurEffectStyleExtraLight};
    case RNSExtendedBlurEffectStyleLight:
      return {UIBlurEffectStyleLight};
    case RNSExtendedBlurEffectStyleDark:
      return {UIBlurEffectStyleDark};
    case RNSExtendedBlurEffectStyleRegular:
      return {UIBlurEffectStyleRegular};
    case RNSExtendedBlurEffectStyleProminent:
      return {UIBlurEffectStyleProminent};
    case RNSExtendedBlurEffectStyleSystemUltraThinMaterial:
      return {UIBlurEffectStyleSystemUltraThinMaterial};
    case RNSExtendedBlurEffectStyleSystemThinMaterial:
      return {UIBlurEffectStyleSystemThinMaterial};
    case RNSExtendedBlurEffectStyleSystemMaterial:
      return {UIBlurEffectStyleSystemMaterial};
    case RNSExtendedBlurEffectStyleSystemThickMaterial:
      return {UIBlurEffectStyleSystemThickMaterial};
    case RNSExtendedBlurEffectStyleSystemChromeMaterial:
      return {UIBlurEffectStyleSystemChromeMaterial};
    case RNSExtendedBlurEffectStyleSystemUltraThinMaterialLight:
      return {UIBlurEffectStyleSystemUltraThinMaterialLight};
    case RNSExtendedBlurEffectStyleSystemThinMaterialLight:
      return {UIBlurEffectStyleSystemThinMaterialLight};
    case RNSExtendedBlurEffectStyleSystemMaterialLight:
      return {UIBlurEffectStyleSystemMaterialLight};
    case RNSExtendedBlurEffectStyleSystemThickMaterialLight:
      return {UIBlurEffectStyleSystemThickMaterialLight};
    case RNSExtendedBlurEffectStyleSystemChromeMaterialLight:
      return {UIBlurEffectStyleSystemChromeMaterialLight};
    case RNSExtendedBlurEffectStyleSystemUltraThinMaterialDark:
      return {UIBlurEffectStyleSystemUltraThinMaterialDark};
    case RNSExtendedBlurEffectStyleSystemThinMaterialDark:
      return {UIBlurEffectStyleSystemThinMaterialDark};
    case RNSExtendedBlurEffectStyleSystemMaterialDark:
      return {UIBlurEffectStyleSystemMaterialDark};
    case RNSExtendedBlurEffectStyleSystemThickMaterialDark:
      return {UIBlurEffectStyleSystemThickMaterialDark};
    case RNSExtendedBlurEffectStyleSystemChromeMaterialDark:
      return {UIBlurEffectStyleSystemChromeMaterialDark};
  }
#endif

  switch (blurEffect) {
    case RNSExtendedBlurEffectStyleNone:
    case RNSExtendedBlurEffectStyleDefault:
      return std::nullopt;
    case RNSExtendedBlurEffectStyleLight:
      return {UIBlurEffectStyleLight};
    case RNSExtendedBlurEffectStyleDark:
      return {UIBlurEffectStyleDark};
    case RNSExtendedBlurEffectStyleRegular:
      return {UIBlurEffectStyleRegular};
    case RNSExtendedBlurEffectStyleProminent:
      return {UIBlurEffectStyleProminent};
    case RNSExtendedBlurEffectStyleExtraLight:
      return {UIBlurEffectStyleExtraLight};
    default:
      return std::nullopt;
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSExtendedBlurEffectStyle(RNSExtendedBlurEffectStyle blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle = RNSMaybeUIBlurEffectStyleFromRNSExtendedBlurEffectStyle(blurEffect);
  return RNSUIBlurEffectFromOptionalUIBlurEffectStyle(maybeStyle);
}

RNSExtendedBlurEffectStyle RNSExtendedBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsScreenTabBarBlurEffect;
#if !TARGET_OS_TV
  switch (blurEffect) {
    case None:
      return RNSExtendedBlurEffectStyleNone;
    case Default:
      return RNSExtendedBlurEffectStyleDefault;
    case ExtraLight:
      return RNSExtendedBlurEffectStyleExtraLight;
    case Light:
      return RNSExtendedBlurEffectStyleLight;
    case Dark:
      return RNSExtendedBlurEffectStyleDark;
    case Regular:
      return RNSExtendedBlurEffectStyleRegular;
    case Prominent:
      return RNSExtendedBlurEffectStyleProminent;
    case SystemUltraThinMaterial:
      return RNSExtendedBlurEffectStyleSystemUltraThinMaterial;
    case SystemThinMaterial:
      return RNSExtendedBlurEffectStyleSystemThinMaterial;
    case SystemMaterial:
      return RNSExtendedBlurEffectStyleSystemMaterial;
    case SystemThickMaterial:
      return RNSExtendedBlurEffectStyleSystemThickMaterial;
    case SystemChromeMaterial:
      return RNSExtendedBlurEffectStyleSystemChromeMaterial;
    case SystemUltraThinMaterialLight:
      return RNSExtendedBlurEffectStyleSystemUltraThinMaterialLight;
    case SystemThinMaterialLight:
      return RNSExtendedBlurEffectStyleSystemThinMaterialLight;
    case SystemMaterialLight:
      return RNSExtendedBlurEffectStyleSystemMaterialLight;
    case SystemThickMaterialLight:
      return RNSExtendedBlurEffectStyleSystemThickMaterialLight;
    case SystemChromeMaterialLight:
      return RNSExtendedBlurEffectStyleSystemChromeMaterialLight;
    case SystemUltraThinMaterialDark:
      return RNSExtendedBlurEffectStyleSystemUltraThinMaterialDark;
    case SystemThinMaterialDark:
      return RNSExtendedBlurEffectStyleSystemThinMaterialDark;
    case SystemMaterialDark:
      return RNSExtendedBlurEffectStyleSystemMaterialDark;
    case SystemThickMaterialDark:
      return RNSExtendedBlurEffectStyleSystemThickMaterialDark;
    case SystemChromeMaterialDark:
      return RNSExtendedBlurEffectStyleSystemChromeMaterialDark;
  }
#endif

  switch (blurEffect) {
    case None:
      return RNSExtendedBlurEffectStyleNone;
    case Default:
      return RNSExtendedBlurEffectStyleDefault;
    case Light:
      return RNSExtendedBlurEffectStyleLight;
    case Dark:
      return RNSExtendedBlurEffectStyleDark;
    case Regular:
      return RNSExtendedBlurEffectStyleRegular;
    case Prominent:
      return RNSExtendedBlurEffectStyleProminent;
    case ExtraLight:
      return RNSExtendedBlurEffectStyleExtraLight;
    default:
      return RNSExtendedBlurEffectStyleDefault;
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
