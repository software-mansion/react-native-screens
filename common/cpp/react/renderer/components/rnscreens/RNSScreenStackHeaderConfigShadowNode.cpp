#include "RNSScreenStackHeaderConfigShadowNode.h"
#include <android/log.h>

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

void RNSScreenStackHeaderConfigShadowNode::layout(LayoutContext layoutContext) {
//    __android_log_print(3, "==mylog==", "RNSScreenStackHeaderConfigShadowNode layout before is x: %f, y: %f, height: %f, width: %f", layoutMetrics_.frame.origin.x, layoutMetrics_.frame.origin.y, layoutMetrics_.frame.size.height, layoutMetrics_.frame.size.width);

    YogaLayoutableShadowNode::layout(layoutContext);
  applyFrameCorrections();

//  __android_log_print(3, "==mylog==", "RNSScreenStackHeaderConfigShadowNode layout after is x: %f, y: %f, height: %f, width: %f", layoutMetrics_.frame.origin.x, layoutMetrics_.frame.origin.y, layoutMetrics_.frame.size.height, layoutMetrics_.frame.size.width);
}

void RNSScreenStackHeaderConfigShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.y = -stateData.frameSize.height;
}

#if !defined(ANDROID) && !defined(NDEBUG)
void RNSScreenStackHeaderConfigShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}
RNSScreenStackHeaderConfigShadowNode::StateData &
RNSScreenStackHeaderConfigShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSScreenStackHeaderConfigShadowNode::StateData &>(
      getStateData());
}
#endif // !ANDROID && !NDEBUG
} // namespace facebook::react
