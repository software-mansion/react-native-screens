#import "RNSConversions-FormSheet.h"
#import "RNSConversions-Tabs.h"

#import <React/RCTConversions.h>

namespace rnscreens::conversion {

#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

UIVisualEffect *_Nullable RNSFormSheetBackgroundEffectFromProps(const react::RNSFormSheetHostProps &props)
{
  switch (props.backgroundEffect) {
    case react::RNSFormSheetHostBackgroundEffect::Automatic:
      return nil;
    case react::RNSFormSheetHostBackgroundEffect::None:
      // A color effect without a color renders no material at all.
      return [UIColorEffect effectWithColor:nil];
    case react::RNSFormSheetHostBackgroundEffect::Color:
      if (!props.backgroundEffectColor) {
        return nil;
      }
      return [UIColorEffect effectWithColor:RCTUIColorFromSharedColor(props.backgroundEffectColor)];
    case react::RNSFormSheetHostBackgroundEffect::Blur:
      return RNSUIBlurEffectFromString(RCTNSStringFromString(react::toString(props.backgroundEffectBlurStyle)));
  }
}

#endif // !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

}; // namespace rnscreens::conversion
