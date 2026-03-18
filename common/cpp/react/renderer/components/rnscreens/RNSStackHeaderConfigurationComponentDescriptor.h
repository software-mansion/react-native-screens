#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderConfigurationShadowNode.h"

namespace facebook::react {

class RNSStackHeaderConfigurationComponentDescriptor final
    : public ConcreteComponentDescriptor<
          RNSStackHeaderConfigurationShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSStackHeaderConfigurationShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
