#pragma once

#if defined(__cplusplus) && RNS_GAMMA_ENABLED

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSSplitHeaderItemPlacement.h"
#import "RNSSplitHeaderItemSpacerPlacement.h"
#import "always_false.h"

namespace react = facebook::react;

namespace rnscreens::conversion {

template <>
RNSSplitHeaderItemPlacement convert(react::RNSSplitHeaderItemIOSPlacement placement);

template <>
RNSSplitHeaderItemSpacerPlacement convert(
    react::RNSSplitHeaderItemSpacerIOSPlacement placement);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus) && RNS_GAMMA_ENABLED
