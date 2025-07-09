#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitViewScreenShadowNode.h"

namespace facebook::react {

class RNSSplitViewScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitViewScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSSplitViewScreenShadowNode *>(&shadowNode));
    auto &splitViewScreenShadowNode =
        static_cast<RNSSplitViewScreenShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&splitViewScreenShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(splitViewScreenShadowNode);

    auto state = std::static_pointer_cast<
        const RNSSplitViewScreenShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
