#import <React/RCTConversions.h>
#import <react/renderer/imagemanager/RCTImagePrimitivesConversions.h>
#import "RNSConversions.h"

namespace rnscreens::conversion {

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsTabBarBlurEffect;
#if !TARGET_OS_TV
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
  }
#endif

  switch (blurEffect) {
    case None:
      return std::nullopt;
    case Light:
      return {UIBlurEffectStyleLight};
    case Dark:
      return {UIBlurEffectStyleDark};
    case Regular:
      return {UIBlurEffectStyleRegular};
    case Prominent:
      return {UIBlurEffectStyleProminent};
    case ExtraLight:
      return {UIBlurEffectStyleExtraLight};
    default:
      return std::nullopt;
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsTabBarBlurEffect(react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle = RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(blurEffect);
  if (maybeStyle) {
    return [UIBlurEffect effectWithStyle:maybeStyle.value()];
  }
  return nil;
}

UIOffset RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct titlePositionAdjustment)
{
  return UIOffsetMake(titlePositionAdjustment.horizontal, titlePositionAdjustment.vertical);
}

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsScreenTabBarBlurEffect;
#if !TARGET_OS_TV
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
  }
#endif

  switch (blurEffect) {
    case None:
      return std::nullopt;
    case Light:
      return {UIBlurEffectStyleLight};
    case Dark:
      return {UIBlurEffectStyleDark};
    case Regular:
      return {UIBlurEffectStyleRegular};
    case Prominent:
      return {UIBlurEffectStyleProminent};
    case ExtraLight:
      return {UIBlurEffectStyleExtraLight};
    default:
      return std::nullopt;
  }
}

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect)
{
  std::optional<UIBlurEffectStyle> maybeStyle =
      RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(blurEffect);
  if (maybeStyle) {
    return [UIBlurEffect effectWithStyle:maybeStyle.value()];
  }
  return nil;
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
