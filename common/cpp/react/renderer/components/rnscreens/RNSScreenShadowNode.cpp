#include "RNSScreenShadowNode.h"
#include <react/renderer/core/LayoutMetrics.h>

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

} // namespace react
} // namespace facebook
