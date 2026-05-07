#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderConfigShadowNode.h"

namespace facebook::react {

class RNSStackHeaderConfigComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderConfigShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
#ifdef ANDROID
    react_native_assert(
        dynamic_cast<RNSStackHeaderConfigShadowNode *>(&shadowNode));
    auto &configShadowNode =
        static_cast<RNSStackHeaderConfigShadowNode &>(shadowNode);
    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&configShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(configShadowNode);

    auto state = std::static_pointer_cast<
        const RNSStackHeaderConfigShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }
#endif // ANDROID
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
