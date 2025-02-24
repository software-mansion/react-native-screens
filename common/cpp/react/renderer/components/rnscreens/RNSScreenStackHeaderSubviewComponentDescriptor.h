#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSScreenStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<
          RNSScreenStackHeaderSubviewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSScreenStackHeaderSubviewShadowNode *>(&shadowNode));
    auto &subviewShadowNode =
        static_cast<RNSScreenStackHeaderSubviewShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&subviewShadowNode));
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(subviewShadowNode);

    auto state = std::static_pointer_cast<
        const RNSScreenStackHeaderSubviewShadowNode::ConcreteState>(
        shadowNode.getMostRecentState());
    auto stateData = state->getData();

    if (!isSizeEmpty(stateData.frameSize)) {
      layoutableShadowNode.setSize(stateData.frameSize);
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
