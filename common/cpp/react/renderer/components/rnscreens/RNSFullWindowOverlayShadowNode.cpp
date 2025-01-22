#include "RNSFullWindowOverlayShadowNode.h"

namespace facebook::react {

extern const char RNSFullWindowOverlayComponentName[] = "RNSFullWindowOverlay";

void RNSFullWindowOverlayShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);

#if !defined(ANDROID)
  applyFrameCorrections();
#endif
}

void RNSFullWindowOverlayShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin -= stateData.contentOffset;
}

} // namespace facebook::react
