#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSTabsHostShadowNode.h"

namespace facebook::react {

class RNSTabsHostComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSTabsHostShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSTabsHostShadowNode *>(&shadowNode));

    ConcreteComponentDescriptor::adopt(shadowNode);
#if !defined(ANDROID)
    auto &tabsShadowNode = static_cast<RNSTabsHostShadowNode &>(shadowNode);
    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    tabsShadowNode.setImageLoader(imageLoader);
#endif // !ANDROID
  }
};

} // namespace facebook::react
