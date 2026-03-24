#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderSubviewShadowNode.h"

namespace facebook::react {

class RNSStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderSubviewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSStackHeaderSubviewShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
