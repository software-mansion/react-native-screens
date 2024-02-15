#include "RNSScreenState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenState::getDynamic() const {
  return folly::dynamic::object("contentOffsetX", contentOffset.x)("contentOffsetY", contentOffset.y);
}
#endif

} // namespace react
} // namespace facebook
