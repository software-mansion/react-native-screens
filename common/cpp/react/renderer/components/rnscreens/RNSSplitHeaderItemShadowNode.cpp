#include "RNSSplitHeaderItemShadowNode.h"

namespace facebook::react {

extern const char RNSSplitHeaderItemComponentName[] = "RNSSplitHeaderItemIOS";

void RNSSplitHeaderItemShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

void RNSSplitHeaderItemShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.x = stateData.contentOffset.x;
  layoutMetrics_.frame.origin.y = stateData.contentOffset.y;
}

} // namespace facebook::react
