#include "RNSStackScreenShadowNode.h"

namespace facebook::react {

extern const char RNSStackScreenComponentName[] = "RNSStackScreen";

Point RNSStackScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
