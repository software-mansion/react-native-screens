#include "RNSStackHeaderConfigShadowNode.h"

namespace facebook::react {

#if !defined(ANDROID)
extern const char RNSStackHeaderConfigComponentName[] =
    "RNSStackHeaderConfigIOS";
#else // !defined(ANDROID)
extern const char RNSStackHeaderConfigComponentName[] =
    "RNSStackHeaderConfigAndroid";
#endif // !defined(ANDROID)

#ifdef ANDROID
Point RNSStackHeaderConfigShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}
#else // ANDROID
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
#endif // ANDROID
} // namespace facebook::react
