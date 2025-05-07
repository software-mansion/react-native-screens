#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace rnscreens {

using namespace facebook::react;

YogaLayoutableShadowNode &shadowNodeFromContext(YGNodeConstRef yogaNode) {
  return dynamic_cast<YogaLayoutableShadowNode &>(
      *static_cast<ShadowNode *>(YGNodeGetContext(yogaNode)));
}
} // namespace rnscreens

namespace facebook::react {

extern const char RNSScreenStackHeaderSubviewComponentName[] =
    "RNSScreenStackHeaderSubview";

void RNSScreenStackHeaderSubviewShadowNode::layout(
    LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

void RNSScreenStackHeaderSubviewShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  // State-based correction
  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.x = stateData.contentOffset.x;
  layoutMetrics_.frame.origin.y = stateData.contentOffset.y;

  // Only a single child is expected
  react_native_assert(yogaNode_.getChildCount() == 1);

  auto childYogaNode = yogaNode_.getChild(0);
  auto &childNode = rnscreens::shadowNodeFromContext(childYogaNode);
  const auto &childLayoutMetrics = childNode.getLayoutMetrics();

  // We want to have exactly the same size as our child.
  layoutMetrics_.frame.size = childLayoutMetrics.frame.size;
}

} // namespace facebook::react
