#include "RNSStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSStackHeaderSubviewComponentName[] =
    "RNSStackHeaderSubview";

#ifdef ANDROID
Point RNSStackHeaderSubviewShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}
#endif // ANDROID

} // namespace facebook::react
