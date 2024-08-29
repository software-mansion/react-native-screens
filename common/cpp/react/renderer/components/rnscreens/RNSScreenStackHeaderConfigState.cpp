#include "RNSScreenStackHeaderConfigState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object("paddingStart", paddingStart_)(
      "paddingEnd_", paddingEnd_);
}

Float RNSScreenStackHeaderConfigState::getPaddingStart() const noexcept {
  return paddingStart_;
}

Float RNSScreenStackHeaderConfigState::getPaddingEnd() const noexcept {
  return paddingEnd_;
}
#endif

} // namespace react
} // namespace facebook
