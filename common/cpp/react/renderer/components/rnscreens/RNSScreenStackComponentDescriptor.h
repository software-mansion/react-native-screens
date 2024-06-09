#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenStackShadowNode.h"

namespace facebook::react {

class RNSScreenStackComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenStackShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
