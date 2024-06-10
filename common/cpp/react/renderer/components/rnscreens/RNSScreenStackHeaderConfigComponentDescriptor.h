#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenComponentDescriptor.h"
#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

class RNSScreenStackHeaderConfigComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenStackHeaderConfigShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
#ifdef ANDROID
    react_native_assert(dynamic_cast<YogaLayoutableShadowNode *>(&shadowNode));
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(shadowNode);

    layoutableShadowNode.setSize(
        {layoutableShadowNode.layoutMetrics_.frame.size.width,
         RNS_HEADER_HEIGHT_CORRECTION});
#endif // ANDROID

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
