#include "RNSScreenStackHeaderSubviewState.h"

namespace facebook {
namespace react {

using namespace rnscreens;

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderSubviewState::getDynamic() const {
  return folly::dynamic::object();
}
#endif

} // namespace react
} // namespace facebook
