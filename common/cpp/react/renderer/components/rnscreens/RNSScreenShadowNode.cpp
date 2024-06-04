#include "RNSScreenShadowNode.h"
#include <react/renderer/core/LayoutMetrics.h>

extern jint HEADER_HEIGHT;

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
    LayoutContext newContext{layoutContext};
    newContext.viewportOffset = {layoutContext.viewportOffset.x, layoutContext.viewportOffset.y + HEADER_HEIGHT};
    auto stateData = getStateData();
    YogaLayoutableShadowNode::layout(newContext);
    auto _stateData = getStateData();
}

} // namespace react
} // namespace facebook
