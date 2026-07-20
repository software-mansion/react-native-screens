#pragma once

#if defined(__cplusplus)

#import "RNSEnums.h"

namespace rnscreens::conversion {

#if !TARGET_OS_TV
UIInterfaceOrientationMask UIInterfaceOrientationMaskFromRNSOrientation(
    RNSOrientation orientation);

RNSOrientation RNSOrientationFromUIInterfaceOrientationMask(
    UIInterfaceOrientationMask orientationMask);
#endif // !TARGET_OS_TV

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
