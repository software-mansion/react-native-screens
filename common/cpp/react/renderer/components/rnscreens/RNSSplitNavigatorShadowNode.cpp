#include "RNSSplitNavigatorShadowNode.h"

namespace facebook::react {

extern const char RNSSplitNavigatorComponentName[] = "RNSSplitNavigator";

Point RNSSplitNavigatorShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
