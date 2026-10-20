#include "RNSStackHeaderItemShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderItemComponentName[] = "RNSStackHeaderItemIOS";

void RNSStackHeaderItemShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

Point RNSStackHeaderItemShadowNode::correctFrameOrigin(Point /*origin*/) const {
  return getStateData().contentOffset;
}

void RNSStackHeaderItemShadowNode::applyFrameCorrections() {
  ensureUnsealed();
  layoutMetrics_.frame.origin = correctFrameOrigin(layoutMetrics_.frame.origin);
}

} // namespace facebook::react
