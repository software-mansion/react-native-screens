#pragma once

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSScrollEdgeEffect RNSScrollEdgeEffectFromSVMLeftEdgeEffect(
    react::RNSScrollViewMarkerLeftScrollEdgeEffect edgeEffect);

RNSScrollEdgeEffect RNSScrollEdgeEffectFromSVMTopEdgeEffect(
    react::RNSScrollViewMarkerTopScrollEdgeEffect edgeEffect);

RNSScrollEdgeEffect RNSScrollEdgeEffectFromSVMRightEdgeEffect(
    react::RNSScrollViewMarkerRightScrollEdgeEffect edgeEffect);

RNSScrollEdgeEffect RNSScrollEdgeEffectFromSVMBottomEdgeEffect(
    react::RNSScrollViewMarkerBottomScrollEdgeEffect edgeEffect);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
