#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

void RNSScreenStackHeaderConfigShadowNode::layout(LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);

#if defined(ANDROID)
  const auto &headerProps =
      *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(
          this->getProps());
  if (headerProps.translucent) {
    // On Android, when header is translucent, the Screen is laid out underneath
    // the native header view, therefore HeaderConfig origin already matches
    // the toolbar & the correction is not needed.
    return;
  }
#endif // defined(ANDROID)
  applyFrameCorrections();
}

void RNSScreenStackHeaderConfigShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  const auto &stateData = getStateData();
  layoutMetrics_.frame.origin.y = -stateData.frameSize.height;
}

#if !defined(ANDROID)
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
#endif // !defined(ANDROID)
} // namespace facebook::react
