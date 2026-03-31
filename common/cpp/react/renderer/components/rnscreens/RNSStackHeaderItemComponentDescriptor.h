#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderItemShadowNode.h"

namespace facebook::react {

class RNSStackHeaderItemComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderItemShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
