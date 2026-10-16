#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSStackHeaderItemShadowNode.h"
#include "utils/LayoutFromState.h"

namespace facebook::react {

class RNSStackHeaderItemComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSStackHeaderItemShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSStackHeaderItemShadowNode *>(&shadowNode));
    auto &itemShadowNode =
        static_cast<RNSStackHeaderItemShadowNode &>(shadowNode);

    // `layout()` takes the frame origin from state, so re-run it when that
    // origin changes.
    rnscreens::dirtyLayoutIfFrameOriginStale(itemShadowNode);

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
