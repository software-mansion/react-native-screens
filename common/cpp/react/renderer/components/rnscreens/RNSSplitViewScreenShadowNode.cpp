#include "RNSSplitViewScreenShadowNode.h"

namespace facebook::react {

extern const char RNSSplitViewScreenComponentName[] = "RNSSplitViewScreen";

Point RNSSplitViewScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
