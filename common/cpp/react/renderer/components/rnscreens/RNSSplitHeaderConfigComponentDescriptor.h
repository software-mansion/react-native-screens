#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitHeaderConfigShadowNode.h"

namespace facebook::react {

class RNSSplitHeaderConfigComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitHeaderConfigShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSSplitHeaderConfigShadowNode *>(&shadowNode));

    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(shadowNode);

    auto state = std::static_pointer_cast<
        const RNSSplitHeaderConfigShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
