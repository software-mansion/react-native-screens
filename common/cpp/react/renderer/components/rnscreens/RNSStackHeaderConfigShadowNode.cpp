#include "RNSStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderConfigComponentName[] = "RNSStackHeaderConfig";

void RNSStackHeaderConfigShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

void RNSStackHeaderConfigShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.x = stateData.contentOffset.x;
  layoutMetrics_.frame.origin.y = stateData.contentOffset.y;
}

} // namespace facebook::react
