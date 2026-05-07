#include "RNSStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderSubviewComponentName[] =
    "RNSStackHeaderSubviewAndroid";

#ifdef ANDROID
Point RNSStackHeaderSubviewShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

void RNSStackHeaderSubviewShadowNode::layout(
    facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

// Subviews are reparented into native Toolbar which handles positioning via
// gravity (START/END). We force x=0 so that Fabric doesn't override the
// Toolbar's layout with Yoga-computed RTL coordinates.
void RNSStackHeaderSubviewShadowNode::applyFrameCorrections() {
  ensureUnsealed();
  layoutMetrics_.frame.origin.x = 0;
}
#endif // ANDROID

} // namespace facebook::react
