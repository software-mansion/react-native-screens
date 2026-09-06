#include "RNSStackScreenShadowNode.h"

namespace facebook::react {

extern const char RNSStackScreenComponentName[] = "RNSStackScreen";

#ifdef ANDROID
Point RNSStackScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}
#endif // ANDROID

} // namespace facebook::react
