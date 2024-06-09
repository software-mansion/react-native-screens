#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}
void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
}

} // namespace react
} // namespace facebook
