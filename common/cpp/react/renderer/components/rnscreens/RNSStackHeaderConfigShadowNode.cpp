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

Point RNSStackHeaderConfigShadowNode::correctFrameOrigin(
    Point /*origin*/) const {
  return getStateData().contentOffset;
}

void RNSStackHeaderConfigShadowNode::applyFrameCorrections() {
  ensureUnsealed();
  layoutMetrics_.frame.origin = correctFrameOrigin(layoutMetrics_.frame.origin);
}

void RNSStackHeaderConfigShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

RNSStackHeaderConfigShadowNode::StateData &
RNSStackHeaderConfigShadowNode::getStateDataMutable() {
  ensureUnsealed();
  return const_cast<RNSStackHeaderConfigShadowNode::StateData &>(
      getStateData());
}
#endif // ANDROID
} // namespace facebook::react
