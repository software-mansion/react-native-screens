#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderSubviewComponentName[] =
    "RNSScreenStackHeaderSubview";

void RNSScreenStackHeaderSubviewShadowNode::layout(
    LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

Point RNSScreenStackHeaderSubviewShadowNode::correctFrameOrigin(
    Point /*origin*/) const {
  return getStateData().contentOffset;
}

void RNSScreenStackHeaderSubviewShadowNode::applyFrameCorrections() {
  ensureUnsealed();
  layoutMetrics_.frame.origin = correctFrameOrigin(layoutMetrics_.frame.origin);
}

} // namespace facebook::react
