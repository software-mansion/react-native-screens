#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderSubviewShadowNode.h"

namespace facebook::react {

class RNSStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderSubviewShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
