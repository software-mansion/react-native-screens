#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSBottomTabsShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSBottomTabsComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSBottomTabsShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSBottomTabsShadowNode *>(&shadowNode));

    ConcreteComponentDescriptor::adopt(shadowNode);
#if !defined(ANDROID) && !defined(NDEBUG)
    auto &configShadowNode = static_cast<RNSBottomTabsShadowNode &>(shadowNode);
    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    configShadowNode.setImageLoader(imageLoader);
#endif // !ANDROID && !NDEBUG
  }
};

} // namespace facebook::react
