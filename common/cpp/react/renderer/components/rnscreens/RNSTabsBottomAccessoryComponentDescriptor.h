#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSTabsBottomAccessoryShadowNode.h"

namespace facebook::react {

class RNSTabsBottomAccessoryComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSTabsBottomAccessoryShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSTabsBottomAccessoryShadowNode *>(&shadowNode));
    auto &tabsBottomAccessoryShadowNode =
        static_cast<RNSTabsBottomAccessoryShadowNode &>(shadowNode);

    auto state = std::static_pointer_cast<
        const RNSTabsBottomAccessoryShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      tabsBottomAccessoryShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
