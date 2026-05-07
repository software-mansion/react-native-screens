#include "RNSTabsBottomAccessoryShadowNode.h"

namespace facebook::react {

extern const char RNSTabsBottomAccessoryComponentName[] =
    "RNSTabsBottomAccessory";

Point RNSTabsBottomAccessoryShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

void RNSTabsBottomAccessoryShadowNode::layout(
    facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();
}

// When calculating content origin offset for bottom accessory we rely on the
// fact that it's positioned at (0,0). In RTL, this is not the case. As we don't
// want to change `direction` (as this change would propagate further down the
// hierarchy), we force x=0 in the shadow node. If this approach turns out to be
// problematic, we can consider adjusting content origin offset to account for
// the "incorrect" layout in RTL.
void RNSTabsBottomAccessoryShadowNode::applyFrameCorrections() {
  ensureUnsealed();
  layoutMetrics_.frame.origin.x = 0;
}

} // namespace facebook::react
