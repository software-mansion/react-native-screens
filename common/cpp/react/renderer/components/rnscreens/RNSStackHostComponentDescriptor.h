#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHostShadowNode.h"

namespace facebook::react {

using RNSStackHostComponentDescriptor =
    ConcreteComponentDescriptor<RNSStackHostShadowNode>;

} // namespace facebook::react
