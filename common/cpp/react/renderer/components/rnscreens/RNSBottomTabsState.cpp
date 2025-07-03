#include "RNSBottomTabsState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSBottomTabsState::getDynamic() const {
  return {};
}
#else // ANDROID
#if !defined(NDEBUG)
void RNSBottomTabsState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> RNSBottomTabsState::getImageLoader()
    const noexcept {
  return imageLoader_;
}
#endif // !NDEBUG
#endif // ANDROID

} // namespace react
} // namespace facebook
