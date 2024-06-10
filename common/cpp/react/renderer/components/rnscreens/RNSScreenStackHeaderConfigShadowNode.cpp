#include "RNSScreenStackHeaderConfigShadowNode.h"

#include <react/renderer/components/view/conversions.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/LayoutMetrics.h>
#include "RNSScreenShadowNode.h"

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

} // namespace facebook::react