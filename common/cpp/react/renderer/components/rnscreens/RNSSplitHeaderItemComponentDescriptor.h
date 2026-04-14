#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitHeaderItemShadowNode.h"

namespace facebook::react {

class RNSSplitHeaderItemComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitHeaderItemShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
