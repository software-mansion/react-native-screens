#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSModalFormSheetShadowNode.h"

namespace facebook::react {

class RNSModalFormSheetComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSModalFormSheetShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSModalFormSheetShadowNode *>(&shadowNode));
    auto &concreteShadowNode =
        static_cast<RNSModalFormSheetShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&concreteShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(concreteShadowNode);

    auto state = std::static_pointer_cast<
        const RNSModalFormSheetShadowNode::ConcreteState>(
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
