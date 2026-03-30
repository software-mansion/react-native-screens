#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSSplitNavigatorShadowNode.h"

namespace facebook::react {

class RNSSplitNavigatorComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSplitNavigatorShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSSplitNavigatorShadowNode *>(&shadowNode));
    auto &splitNavigatorShadowNode =
        static_cast<RNSSplitNavigatorShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&splitNavigatorShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(splitNavigatorShadowNode);

    auto state =
        std::static_pointer_cast<const RNSSplitNavigatorShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
