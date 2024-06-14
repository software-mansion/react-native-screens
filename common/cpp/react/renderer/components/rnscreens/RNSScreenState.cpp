#include "RNSScreenState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}

void RNSScreenState::setHeaderHeight(float headerHeight) {
  lastKnownHeaderHeight_ = headerHeight;
}

float RNSScreenState::getLastKnownHeaderHeight() const noexcept {
  return lastKnownHeaderHeight_;
}

HeaderCorrectionModes &RNSScreenState::getHeaderCorrectionModes() noexcept {
  return headerCorrectionModes_;
}

const HeaderCorrectionModes &RNSScreenState::getHeaderCorrectionModes()
    const noexcept {
  return headerCorrectionModes_;
}

#endif

} // namespace react
} // namespace facebook
