#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

namespace yoga = facebook::yoga;

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);

#ifdef ANDROID
  applyFrameCorrections();
#endif // ANDROID
}

#ifdef ANDROID
void RNSScreenShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  // On the very first layout we want to correct both Y offset and frame size.
  // On consecutive layouts we want to correct only Y offset, as the frame size
  // is received from JVM side. This is done so if the Screen dimensions are
  // read from ShadowTree (e.g by reanimated) they have chance of being
  // accurate. On JVM side we do ignore this frame anyway, because
  // ScreenStackViewManager.needsCustomLayoutForChildren() == true.
  layoutMetrics_.frame.origin.y += lastKnownHeaderHeight_ *
      headerCorrectionModes_.check(
          HeaderCorrectionModes::Mode::FrameOriginCorrection);
  layoutMetrics_.frame.size.height -= lastKnownHeaderHeight_ *
      headerCorrectionModes_.check(
          HeaderCorrectionModes::Mode::FrameHeightCorrection);
}

void RNSScreenShadowNode::setHeaderHeight(float headerHeight) {
  ensureUnsealed();
  lastKnownHeaderHeight_ = headerHeight;
}

HeaderCorrectionModes &RNSScreenShadowNode::getHeaderCorrectionModes() {
  return headerCorrectionModes_;
}

#endif // ANDROID

} // namespace react
} // namespace facebook
