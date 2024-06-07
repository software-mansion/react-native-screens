#include "RNSScreenShadowNode.h"
#include <react/renderer/core/LayoutMetrics.h>

extern jint HEADER_HEIGHT;
jclass RNSPACKAGE_REFERENCE = nullptr;

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
  //    auto stateData = getStateData();
  //
  //    // Inside this method, we have our new metrics already set by our
  //    parent. LayoutMetrics currentMetrics = getLayoutMetrics();
  //
  //    // If we do not have state, this means we're before first Android
  //    layout, or we have not received
  //    // state update from JVM side.
  //    if (stateData.frameSize.width != 0) {
  //        // Then if we have header (supposed) header dimensions already set
  //        we can offset our screen
  //        // So that it is positioned respecting header offset.
  //        if (HEADER_HEIGHT != 0 && currentMetrics.contentInsets.bottom == 0)
  //        {
  ////            currentMetrics.contentInsets.top = HEADER_HEIGHT;
  ////            layoutContext.viewportOffset.y += HEADER_HEIGHT;
  ////            currentMetrics.frame.origin.y = HEADER_HEIGHT;
  //        }
  //        else {
  //            LOG(INFO) << "Missing header dimensions\n";
  //        }
  //    }
  //
  YogaLayoutableShadowNode::layout(layoutContext);
}

Size RNSScreenShadowNode::measure(
    const LayoutContext &layoutContext,
    const LayoutConstraints &layoutConstraints) const {
  return LayoutableShadowNode::measure(layoutContext, layoutConstraints);
}

Size RNSScreenShadowNode::measureContent(
    const LayoutContext &layoutContext,
    const LayoutConstraints &layoutConstraints) const {
  return LayoutableShadowNode::measureContent(layoutContext, layoutConstraints);
}

} // namespace react
} // namespace facebook
