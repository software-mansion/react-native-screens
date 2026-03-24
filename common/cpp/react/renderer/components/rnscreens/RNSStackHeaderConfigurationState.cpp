#include "RNSStackHeaderConfigurationState.h"

namespace facebook::react {

#ifdef ANDROID
folly::dynamic RNSStackHeaderConfigurationState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}
#endif // ANDROID

} // namespace facebook::react
