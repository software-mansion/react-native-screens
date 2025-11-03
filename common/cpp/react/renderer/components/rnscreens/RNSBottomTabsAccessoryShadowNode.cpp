#include "RNSBottomTabsAccessoryShadowNode.h"

namespace facebook::react {

extern const char RNSBottomTabsAccessoryComponentName[] =
    "RNSBottomTabsAccessory";

Point RNSBottomTabsAccessoryShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
