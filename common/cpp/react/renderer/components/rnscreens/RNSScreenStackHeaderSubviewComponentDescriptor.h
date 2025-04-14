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
        shadowNode.getState());
    auto stateData = state->getData();

    auto mostRecentState = std::static_pointer_cast<
        const RNSScreenStackHeaderSubviewShadowNode::ConcreteState>(
        shadowNode.getMostRecentState());

    auto mostRecentStateData = mostRecentState->getData();

    std::printf(
        "SubviewCD [%d] adopt frameSize {%.2lf, %.2lf}, mostRecent {%.2lf, %.2lf}\n",
        shadowNode.getTag(),
        stateData.frameSize.width,
        stateData.frameSize.height,
        mostRecentStateData.frameSize.width,
        mostRecentStateData.frameSize.height);

    if (!isSizeEmpty(stateData.frameSize)) {
      // This is a ugly hack to workaround issue with dynamic content change.
      // When the size of this shadow node contents (children) change due to JS
      // update, e.g. new icon is added, if the size is set for the yogaNode
      // corresponding to this shadow node, the enforced size will be used
      // and the size won't be updated by Yoga to reflect the contents size
      // change ->
      // -> host tree won't get layout metrics update -> we won't trigger native
      // layout -> the views in header will be positioned incorrectly. Here we
      // try to detect, whether this shadow node is cloned as a result of state
      // update (we assume that only source if the state updates is HostTree) or
      // other change.
      if (stateData.frameSize != mostRecentStateData.frameSize) {
        std::printf("SubviewCD [%d] adopt APPLY\n", shadowNode.getTag());
        layoutableShadowNode.setSize(stateData.frameSize);
      } else {
        // If the state has not changed we assign undefined size, to allow Yoga
        // to recompute the shadow node layout.
        std::printf("SubviewCD [%d] adopt ZERO\n", shadowNode.getTag());
        layoutableShadowNode.setSize({YGUndefined, YGUndefined});
      }
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
