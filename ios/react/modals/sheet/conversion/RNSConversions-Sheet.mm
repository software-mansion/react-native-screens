#import "RNSConversions-Sheet.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <optional>

namespace rnscreens::conversion {

RNSSheetPresentationStyle RNSSheetPresentationStyleFromHostProp(react::RNSSheetHostPresentationStyle presentationStyle)
{
  switch (presentationStyle) {
    using enum react::RNSSheetHostPresentationStyle;
    case PageSheet:
      return RNSSheetPresentationStylePageSheet;
    case FormSheet:
      return RNSSheetPresentationStyleFormSheet;
    default:
      RCTLogError(@"[RNScreens] Unsupported presentationStyle value, falling back to formSheet.");
      return RNSSheetPresentationStyleFormSheet;
  }
}

#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

static std::optional<UIBlurEffectStyle> RNSUIBlurEffectStyleFromBackgroundEffectBlurStyle(
    react::RNSSheetHostBackgroundEffectBlurStyle blurStyle)
{
  switch (blurStyle) {
    using enum react::RNSSheetHostBackgroundEffectBlurStyle;
    case ExtraLight:
      return UIBlurEffectStyleExtraLight;
    case Light:
      return UIBlurEffectStyleLight;
    case Dark:
      return UIBlurEffectStyleDark;
    case Regular:
      return UIBlurEffectStyleRegular;
    case Prominent:
      return UIBlurEffectStyleProminent;
    case SystemUltraThinMaterial:
      return UIBlurEffectStyleSystemUltraThinMaterial;
    case SystemThinMaterial:
      return UIBlurEffectStyleSystemThinMaterial;
    case SystemMaterial:
      return UIBlurEffectStyleSystemMaterial;
    case SystemThickMaterial:
      return UIBlurEffectStyleSystemThickMaterial;
    case SystemChromeMaterial:
      return UIBlurEffectStyleSystemChromeMaterial;
    case SystemUltraThinMaterialLight:
      return UIBlurEffectStyleSystemUltraThinMaterialLight;
    case SystemThinMaterialLight:
      return UIBlurEffectStyleSystemThinMaterialLight;
    case SystemMaterialLight:
      return UIBlurEffectStyleSystemMaterialLight;
    case SystemThickMaterialLight:
      return UIBlurEffectStyleSystemThickMaterialLight;
    case SystemChromeMaterialLight:
      return UIBlurEffectStyleSystemChromeMaterialLight;
    case SystemUltraThinMaterialDark:
      return UIBlurEffectStyleSystemUltraThinMaterialDark;
    case SystemThinMaterialDark:
      return UIBlurEffectStyleSystemThinMaterialDark;
    case SystemMaterialDark:
      return UIBlurEffectStyleSystemMaterialDark;
    case SystemThickMaterialDark:
      return UIBlurEffectStyleSystemThickMaterialDark;
    case SystemChromeMaterialDark:
      return UIBlurEffectStyleSystemChromeMaterialDark;
    default:
      return std::nullopt;
  }
}

UIVisualEffect *_Nullable RNSSheetBackgroundEffectFromProps(const react::RNSSheetHostProps &props)
{
  switch (props.backgroundEffect) {
    case react::RNSSheetHostBackgroundEffect::Automatic:
      return nil;
    case react::RNSSheetHostBackgroundEffect::None:
      // A color effect with a clear color renders no material at all.
      return [UIColorEffect effectWithColor:[UIColor clearColor]];
    case react::RNSSheetHostBackgroundEffect::Color:
      if (!props.backgroundEffectColor) {
        return nil;
      }
      return [UIColorEffect effectWithColor:RCTUIColorFromSharedColor(props.backgroundEffectColor)];
    case react::RNSSheetHostBackgroundEffect::Blur: {
      std::optional<UIBlurEffectStyle> style =
          RNSUIBlurEffectStyleFromBackgroundEffectBlurStyle(props.backgroundEffectBlurStyle);
      if (!style.has_value()) {
        RCTLogError(@"[RNScreens] Unsupported backgroundEffectBlurStyle, using the system material.");
        return nil;
      }
      return [UIBlurEffect effectWithStyle:style.value()];
    }
    default:
      RCTLogError(@"[RNScreens] Unsupported backgroundEffect value, using the system material.");
      return nil;
  }
}

#endif // !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

}; // namespace rnscreens::conversion
