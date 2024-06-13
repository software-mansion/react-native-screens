#include "RNSScreenShadowNode.h"

#include <yoga/enums/PhysicalEdge.h>

namespace facebook {
namespace react {

namespace yoga = facebook::yoga;

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

void RNSScreenShadowNode::setTopMargin(float marginTop) {
  ensureUnsealed();

  auto style = yogaNode_.style();
  style.setMargin(yoga::Edge::Top, yoga::value::points(marginTop));

  auto newMarginTop = yoga::value::points(marginTop);

  if (newMarginTop != style.margin(yoga::Edge::Top)) {
    style.setMargin(yoga::Edge::Top, newMarginTop);
    yogaNode_.setStyle(style);
    yogaNode_.setDirty(true);
  }
}

constexpr RNSScreenShadowNode::PropsT &
RNSScreenShadowNode::getConcretePropsMut() {
  const auto &constProps = getConcreteProps();
  return const_cast<RNSScreenShadowNode::PropsT &>(constProps);
}

void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
}

} // namespace react
} // namespace facebook
