#include "RNSStackScreenShadowNode.h"

namespace facebook::react {

extern const char RNSStackScreenComponentName[] = "RNSStackScreen";

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
