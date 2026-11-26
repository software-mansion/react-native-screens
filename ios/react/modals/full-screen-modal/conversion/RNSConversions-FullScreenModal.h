#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSFullScreenModalPresentationStyle.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSFullScreenModalPresentationStyle
RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
