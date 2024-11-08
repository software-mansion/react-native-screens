#include "RNSScreenStackHeaderSubviewState.h"

namespace facebook {
namespace react {

using namespace rnscreens;

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderSubviewState::getDynamic() const {
  return folly::dynamic::object();
}
#else // ANDROID
#ifndef NDEBUG
void RNSScreenStackHeaderSubviewState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> RNSScreenStackHeaderSubviewState::getImageLoader()
    const noexcept {
  return imageLoader_;
}
#endif // NDEBUG
#endif // ANDROID

} // namespace react
} // namespace facebook
