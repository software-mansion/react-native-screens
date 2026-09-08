#include "RNSScreenStackHeaderSubviewState.h"

namespace facebook {
namespace react {

using namespace rnscreens;

#ifdef ANDROID
folly::dynamic RNSScreenStackHeaderSubviewState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height)("contentOffsetX", contentOffset.x)(
      "contentOffsetY", contentOffset.y);
}
#endif // ANDROID

} // namespace react
} // namespace facebook
