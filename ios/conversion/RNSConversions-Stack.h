#pragma once

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSStackScreenComponentView.h"
#import "always_false.h"

namespace rnscreens::conversion {

template <>
RNSStackScreenActivityMode convert(react::RNSStackScreenActivityMode mode);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
