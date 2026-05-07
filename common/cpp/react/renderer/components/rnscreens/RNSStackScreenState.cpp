#include "RNSStackScreenState.h"

namespace facebook::react {

#ifdef ANDROID
folly::dynamic RNSStackScreenState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}
#endif // ANDROID

} // namespace facebook::react
