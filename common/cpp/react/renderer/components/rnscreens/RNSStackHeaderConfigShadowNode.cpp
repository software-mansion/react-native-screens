#include "RNSStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderConfigComponentName[] = "RNSStackHeaderConfig";

#ifdef ANDROID
Point RNSStackHeaderConfigShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}
#endif // ANDROID

} // namespace facebook::react
