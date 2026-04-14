#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitHeaderItemSpacerShadowNode.h"

namespace facebook::react {

class RNSSplitHeaderItemSpacerComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitHeaderItemSpacerShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
