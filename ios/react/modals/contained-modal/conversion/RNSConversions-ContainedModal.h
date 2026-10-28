#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSContainedModalPresentationStyle.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

#pragma mark ContainedModalHost props

RNSContainedModalPresentationStyle ContainedModalPresentationStyleFromHostProp(
    react::RNSContainedModalHostPresentationStyle presentationStyle);

} // namespace rnscreens::conversion

#endif // defined(__cplusplus)
