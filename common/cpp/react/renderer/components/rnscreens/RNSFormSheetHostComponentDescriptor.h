#pragma once

#if !defined(ANDROID)

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFormSheetHostShadowNode.h"

namespace facebook::react {

class RNSFormSheetHostComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFormSheetHostShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSFormSheetHostShadowNode *>(&shadowNode));
    auto &concreteShadowNode =
        static_cast<RNSFormSheetHostShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&concreteShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(concreteShadowNode);

    auto state = std::static_pointer_cast<
        const RNSFormSheetHostShadowNode::ConcreteState>(shadowNode.getState());

    auto stateData = state->getData();

    layoutableShadowNode.setSize(
        Size{stateData.frameSize.width, stateData.frameSize.height});

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react

#endif // !defined(ANDROID)
