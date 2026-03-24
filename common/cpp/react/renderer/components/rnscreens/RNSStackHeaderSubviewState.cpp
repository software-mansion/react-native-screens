#include "RNSStackHeaderSubviewState.h"

namespace facebook::react {

#ifdef ANDROID
folly::dynamic RNSStackHeaderSubviewState::getDynamic() const {
  return folly::dynamic::object("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}
#endif // ANDROID

} // namespace facebook::react
