#import "RNSConversions.h"

namespace rnscreens::conversion {

RNSBlurEffectStyle RNSBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    facebook::react::RNSBottomTabsTabBarBlurEffect blurEffect)
{
  using enum facebook::react::RNSBottomTabsTabBarBlurEffect;
#if !TARGET_OS_TV
  switch (blurEffect) {
    case None:
      return RNSBlurEffectStyleNone;
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
  }
#endif

  switch (blurEffect) {
    case None:
      return RNSBlurEffectStyleNone;
    case Light:
      return RNSBlurEffectStyleLight;
    case Dark:
      return RNSBlurEffectStyleDark;
    case Regular:
      return RNSBlurEffectStyleRegular;
    case Prominent:
      return RNSBlurEffectStyleProminent;
    case ExtraLight:
    default:
      return RNSBlurEffectStyleNone;
  }
}

}; // namespace rnscreens::conversion
