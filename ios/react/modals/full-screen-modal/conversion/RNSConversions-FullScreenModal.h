#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"
#import "RNSFullScreenModalPresentationStyle.h"
#import "RNSFullScreenModalTransition.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSFullScreenModalPresentationStyle
RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle);

RNSFullScreenModalTransition RNSFullScreenModalTransitionFromHostProp(
    react::RNSFullScreenModalHostTransition transition);

RNSOrientation RNSOrientationFromFullScreenModalHostOrientation(
    react::RNSFullScreenModalHostOrientation orientation);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
