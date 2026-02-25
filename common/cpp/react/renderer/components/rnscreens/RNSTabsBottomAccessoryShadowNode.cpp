#include "RNSTabsBottomAccessoryShadowNode.h"

namespace facebook::react {

extern const char RNSTabsBottomAccessoryComponentName[] =
    "RNSTabsBottomAccessory";

Point RNSTabsBottomAccessoryShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
