#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

void RNSScreenStackHeaderConfigShadowNode::layout(LayoutContext layoutContext) {
    YogaLayoutableShadowNode::layout(layoutContext);
    applyFrameCorrections();
}

void RNSScreenStackHeaderConfigShadowNode::applyFrameCorrections() {
    ensureUnsealed();

    const auto &stateData = getStateData();
    layoutMetrics_.frame.origin.y = -stateData.frameSize.height;
}

}
