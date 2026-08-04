#include "RNSStackHeaderConfigState.h"

namespace facebook::react {

void RNSStackHeaderConfigState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> RNSStackHeaderConfigState::getImageLoader() const noexcept {
  return imageLoader_;
}

#ifdef ANDROID
folly::dynamic RNSStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}
#endif // ANDROID

} // namespace facebook::react
