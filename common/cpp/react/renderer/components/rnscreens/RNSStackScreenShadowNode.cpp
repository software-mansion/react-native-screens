#include "RNSStackScreenShadowNode.h"

namespace facebook::react {

#if !defined(ANDROID)
extern const char RNSStackScreenComponentName[] = "RNSStackScreenIOS";
#else // !defined(ANDROID)
extern const char RNSStackScreenComponentName[] = "RNSStackScreenAndroid";
#endif // !defined(ANDROID)

bool RNSStackScreenShadowNode::shouldApplyReportedFrame() const {
#ifdef ANDROID
  return true;
#else
  return getConcreteProps().reportsFrameToShadowTree;
#endif // ANDROID
}

Point RNSStackScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  if (!shouldApplyReportedFrame()) {
    return {};
  }
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
