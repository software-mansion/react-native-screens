#include "RNSScreenStackHeaderConfigState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object();
}
#endif

} // namespace react
} // namespace facebook
