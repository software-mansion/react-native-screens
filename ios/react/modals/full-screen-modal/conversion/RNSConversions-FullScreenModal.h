#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSFullScreenModalAnimation.h"
#import "RNSFullScreenModalPresentationStyle.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSFullScreenModalPresentationStyle
RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle);

RNSFullScreenModalAnimation RNSFullScreenModalAnimationFromHostProp(
    react::RNSFullScreenModalHostAnimation animation);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
