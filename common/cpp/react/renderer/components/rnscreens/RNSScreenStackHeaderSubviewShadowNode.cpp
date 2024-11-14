#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderSubviewComponentName[] =
    "RNSScreenStackHeaderSubview";

void RNSScreenStackHeaderSubviewShadowNode::layout(LayoutContext layoutContext) {
    YogaLayoutableShadowNode::layout(layoutContext);

#ifdef ANDROID
    applyFrameCorrections();
#endif // ANDROID
}

#ifdef ANDROID
void RNSScreenStackHeaderSubviewShadowNode::applyFrameCorrections() {
    ensureUnsealed();

    const auto &stateData = getStateData();
    layoutMetrics_.frame.origin.x = stateData.contentOffset.x;
    layoutMetrics_.frame.origin.y = stateData.contentOffset.y;
}
#endif // ANDROID

}
