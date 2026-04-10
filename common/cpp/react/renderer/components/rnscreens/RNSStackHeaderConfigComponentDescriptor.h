#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderConfigShadowNode.h"

namespace facebook::react {

class RNSStackHeaderConfigComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderConfigShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSStackHeaderConfigShadowNode *>(&shadowNode));

    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(shadowNode);

    auto state = std::static_pointer_cast<
        const RNSStackHeaderConfigShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
