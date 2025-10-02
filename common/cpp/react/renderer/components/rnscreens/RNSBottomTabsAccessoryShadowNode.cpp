#include "RNSBottomTabsAccessoryShadowNode.h"

#include <yoga/Yoga.h>

namespace facebook::react {

using namespace yoga;

extern const char RNSBottomTabsAccessoryComponentName[] =
    "RNSBottomTabsAccessory";

Point RNSBottomTabsAccessoryShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.offset;
}

} // namespace facebook::react
