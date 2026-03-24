#include "RNSStackHeaderConfigurationShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderConfigurationComponentName[] =
    "RNSStackHeaderConfiguration";

#ifdef ANDROID
Point RNSStackHeaderConfigurationShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}
#endif // ANDROID

} // namespace facebook::react
