
#include "RNSScreenStackHeaderConfigState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("paddingStart", paddingStart)(
      "paddingEnd", paddingEnd);
}
#else // ANDROID
#ifndef NDEBUG
void RNSScreenStackHeaderConfigState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> RNSScreenStackHeaderConfigState::getImageLoader()
    const noexcept {
  return imageLoader_;
}
#endif // !NDEBUG
#endif // ANDROID

} // namespace react
} // namespace facebook
