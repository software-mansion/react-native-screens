#include "RNSSheetHostState.h"

namespace facebook::react {

#ifdef ANDROID
folly::dynamic RNSSheetHostState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height);
}
#endif // ANDROID

} // namespace facebook::react
