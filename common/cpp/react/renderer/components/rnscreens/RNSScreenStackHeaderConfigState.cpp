#include "RNSScreenStackHeaderConfigState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object("paddingStart", paddingStart_)(
      "paddingEnd_", paddingEnd_);
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

Float RNSScreenStackHeaderConfigState::getPaddingStart() const noexcept {
  return paddingStart_;
}

Float RNSScreenStackHeaderConfigState::getPaddingEnd() const noexcept {
  return paddingEnd_;
}

} // namespace react
} // namespace facebook
