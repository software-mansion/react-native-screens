#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitScreenShadowNode.h"

namespace facebook::react {

class RNSSplitScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSSplitScreenShadowNode *>(&shadowNode));
    auto &splitScreenShadowNode =
        static_cast<RNSSplitScreenShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&splitScreenShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(splitScreenShadowNode);

    auto state = std::static_pointer_cast<
        const RNSSplitScreenShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
