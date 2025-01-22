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

  // During mounting phase due to view flattening the frame origin can be
  // offsetted by non-zero point value, while we require FullWindowOverlay view
  // to be always positioned at (0, 0). By adding this correction, the view will
  // be positioned at (0, 0) after mounting stage finishes. See:
  // https://github.com/software-mansion/react-native-screens/pull/2641
  layoutMetrics_.frame.origin -= stateData.contentOffset;
}

} // namespace facebook::react
