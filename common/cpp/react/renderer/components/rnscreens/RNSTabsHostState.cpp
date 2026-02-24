#include "RNSTabsHostState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSTabsHostState::getDynamic() const {
  return {};
}
#else // ANDROID

void RNSTabsHostState::setImageLoader(std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> RNSTabsHostState::getImageLoader() const noexcept {
  return imageLoader_;
}
#endif // ANDROID

} // namespace react
} // namespace facebook
