#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSBottomTabsAccessoryShadowNode.h"

namespace facebook::react {

class RNSBottomTabsAccessoryComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSBottomTabsAccessoryShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSBottomTabsAccessoryShadowNode *>(&shadowNode));
    auto &bottomTabsAccessoryShadowNode =
        static_cast<RNSBottomTabsAccessoryShadowNode &>(shadowNode);

    auto state = std::static_pointer_cast<
        const RNSBottomTabsAccessoryShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      bottomTabsAccessoryShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
