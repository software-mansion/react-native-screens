#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFullWindowOverlayShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSFullWindowOverlayComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFullWindowOverlayShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSFullWindowOverlayShadowNode *>(&shadowNode));
    auto &subviewShadowNode =
        static_cast<RNSFullWindowOverlayShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&subviewShadowNode));
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(subviewShadowNode);

    auto state = std::static_pointer_cast<
        const RNSFullWindowOverlayShadowNode::ConcreteState>(
        shadowNode.getState());
    auto stateData = state->getData();

    /*if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {*/
    /*  layoutableShadowNode.setSize(*/
    /*      Size{stateData.frameSize.width, stateData.frameSize.height});*/
    /*}*/

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
