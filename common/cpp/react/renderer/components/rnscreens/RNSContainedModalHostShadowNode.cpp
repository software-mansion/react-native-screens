#include "RNSContainedModalHostShadowNode.h"

#if !defined(ANDROID)

namespace facebook::react {

extern const char RNSContainedModalHostComponentName[] =
    "RNSContainedModalHost";

Point RNSContainedModalHostShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

} // namespace facebook::react

#endif // !defined(ANDROID)
