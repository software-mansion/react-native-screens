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
#endif // ANDROID

} // namespace facebook::react
