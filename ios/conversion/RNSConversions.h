#pragma once

#if defined(__cplusplus)
#import <UIKit/UIKit.h>
#import <folly/dynamic.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

// copied from FollyConvert.mm
id RNSConvertFollyDynamicToId(const folly::dynamic &dyn);

#if !TARGET_OS_TV
UIInterfaceOrientationMask UIInterfaceOrientationMaskFromRNSOrientation(
    RNSOrientation orientation);

// Currently unused in stack v5. Maybe remove after stopping support for v4.
RNSOrientation RNSOrientationFromUIInterfaceOrientationMask(
    UIInterfaceOrientationMask orientationMask);
#endif // !TARGET_OS_TV

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
