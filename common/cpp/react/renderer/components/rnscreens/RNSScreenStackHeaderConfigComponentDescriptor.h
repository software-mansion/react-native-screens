#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSScreenStackHeaderConfigComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenStackHeaderConfigShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSScreenStackHeaderConfigShadowNode *>(&shadowNode));
    auto &configShadowNode =
        static_cast<RNSScreenStackHeaderConfigShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&configShadowNode));
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(configShadowNode);

    auto state = std::static_pointer_cast<
        const RNSScreenStackHeaderConfigShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

#ifdef ANDROID
    if (stateData.frameSize.width != 0) {
      layoutableShadowNode.setSize({stateData.frameSize.width, YGUndefined});
      layoutableShadowNode.setPadding({
          stateData.paddingStart,
          0,
          stateData.paddingEnd,
          0,
      });
    }
#else
    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(stateData.frameSize);
      layoutableShadowNode.setPadding(stateData.edgeInsets);
    }
#endif // ANDROID

    ConcreteComponentDescriptor::adopt(shadowNode);
#if !defined(ANDROID) && !defined(NDEBUG)
    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    configShadowNode.setImageLoader(imageLoader);
#endif // !ANDROID && !NDEBUG
  }
};

} // namespace facebook::react
