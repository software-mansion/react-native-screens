#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID

#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackScreenShadowNode.h"

namespace facebook::react {

class RNSStackScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
#ifdef ANDROID
    react_native_assert(dynamic_cast<RNSStackScreenShadowNode *>(&shadowNode));
    auto &screenShadowNode =
        static_cast<RNSStackScreenShadowNode &>(shadowNode);
    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&screenShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const RNSStackScreenShadowNode::ConcreteState>(
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
