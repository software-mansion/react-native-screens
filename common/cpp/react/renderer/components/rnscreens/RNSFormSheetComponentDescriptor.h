#pragma once

#ifndef ANDROID

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFormSheetShadowNode.h"

namespace facebook::react {

class RNSFormSheetComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFormSheetShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSFormSheetShadowNode *>(&shadowNode));
    auto &concreteShadowNode =
        static_cast<RNSFormSheetShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&concreteShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(concreteShadowNode);

    auto state =
        std::static_pointer_cast<const RNSFormSheetShadowNode::ConcreteState>(
            shadowNode.getState());

    auto stateData = state->getData();

    if (stateData.frameSize.width >= 0 && stateData.frameSize.height >= 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react

#endif // ANDROID
