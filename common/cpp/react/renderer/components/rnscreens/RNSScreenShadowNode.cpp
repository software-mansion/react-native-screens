#include "RNSScreenShadowNode.h"

#include <yoga/enums/PhysicalEdge.h>
#include "RNSScreenStackHeaderConfigShadowNode.h"

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
  getConcretePropsMut().yogaStyle.setMargin(
      yoga::Edge::Top, yoga::StyleLength::points(marginTop));
}

constexpr RNSScreenShadowNode::PropsT &
RNSScreenShadowNode::getConcretePropsMut() {
  const auto &constProps = getConcreteProps();
  return const_cast<RNSScreenShadowNode::PropsT &>(constProps);
}

} // namespace react
} // namespace facebook
