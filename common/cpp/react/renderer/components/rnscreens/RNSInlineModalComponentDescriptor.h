#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSInlineModalShadowNode.h"

namespace facebook::react {

class RNSInlineModalComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSInlineModalShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSInlineModalShadowNode *>(&shadowNode));
    auto &concreteShadowNode =
        static_cast<RNSInlineModalShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&concreteShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(concreteShadowNode);

    auto state =
        std::static_pointer_cast<const RNSInlineModalShadowNode::ConcreteState>(
            shadowNode.getState());

    if (state != nullptr) {
      auto stateData = state->getData();

      if (stateData.frameSize.width >= 0 && stateData.frameSize.height >= 0) {
        layoutableShadowNode.setSize(
            Size{stateData.frameSize.width, stateData.frameSize.height});
      }
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
