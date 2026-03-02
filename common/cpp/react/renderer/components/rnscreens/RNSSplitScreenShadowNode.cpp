#include "RNSSplitScreenShadowNode.h"

namespace facebook::react {

extern const char RNSSplitScreenComponentName[] = "RNSSplitScreen";

Point RNSSplitScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
