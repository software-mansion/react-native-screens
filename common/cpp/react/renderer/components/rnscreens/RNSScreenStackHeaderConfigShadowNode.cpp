#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

void RNSScreenStackHeaderConfigShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);
  #if defined(ANDROID)
  // When translucent is set, the content will display under the header.
  // We do not need to apply the frame corrections described here: https://github.com/software-mansion/react-native-screens/pull/2466
  auto& stackProps = dynamic_cast<const RNSScreenStackHeaderConfigProps&>(*props_);
  if (stackProps.translucent) {
    return;
  }
  #endif // !ANDROID 
  applyFrameCorrections();
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
