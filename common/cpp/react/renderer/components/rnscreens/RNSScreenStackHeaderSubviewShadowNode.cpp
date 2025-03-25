#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderSubviewComponentName[] =
    "RNSScreenStackHeaderSubview";

void RNSScreenStackHeaderSubviewShadowNode::layout(
    LayoutContext layoutContext) {
    __android_log_print(3, "==mylog==", "RNSScreenStackHeaderSubviewShadowNode layout before is x: %f, y: %f, height: %f, width: %f", layoutMetrics_.frame.origin.x, layoutMetrics_.frame.origin.y, layoutMetrics_.frame.size.height, layoutMetrics_.frame.size.width);

    YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();

    __android_log_print(3, "==mylog==", "RNSScreenStackHeaderSubviewShadowNode layout after is x: %f, y: %f, height: %f, width: %f", layoutMetrics_.frame.origin.x, layoutMetrics_.frame.origin.y, layoutMetrics_.frame.size.height, layoutMetrics_.frame.size.width);
}

void RNSScreenStackHeaderSubviewShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.x = stateData.contentOffset.x;
  layoutMetrics_.frame.origin.y = stateData.contentOffset.y;
}

} // namespace facebook::react
