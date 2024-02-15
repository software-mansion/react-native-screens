#pragma once

#include <react/debug/react_native_assert.h>
#include "RNSScreenShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode& shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSScreenShadowNode*>(&shadowNode));
    auto& screenShadowNode =
        static_cast<RNSScreenShadowNode&>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode*>(&screenShadowNode));
    auto& layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode&>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

    // Instead of setting the screen size explicitly, we can let yoga calculate it and instead
    // cut the bottom part out using padding to make sure that content size + header size
    // doesn't exceed the viewport size. The drawback of this approach is that the size of the 
    // screen component will be too large by a header. This means that calling measure on the
    // screen component will return wrong height.
    if (stateData.contentOffset.y != 0) {
      layoutableShadowNode.setPadding({.bottom = stateData.contentOffset.y});
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook
