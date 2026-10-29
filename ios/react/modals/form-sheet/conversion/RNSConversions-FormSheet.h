#pragma once

#if defined(__cplusplus)

#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSDefines.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

API_AVAILABLE(ios(26.1))
UIVisualEffect *_Nullable RNSFormSheetBackgroundEffectFromProps(
    const react::RNSFormSheetHostProps &props);

#endif // !TARGET_OS_TV && !TARGET_OS_VISION &&
       // RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
