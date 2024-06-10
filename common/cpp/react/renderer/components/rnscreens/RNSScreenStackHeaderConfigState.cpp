#include "RNSScreenStackHeaderConfigState.h"

namespace facebook::react {

RNSScreenStackHeaderConfigState::RNSScreenStackHeaderConfigState() {}

#ifdef ANDROID
RNSScreenStackHeaderConfigState::RNSScreenStackHeaderConfigState(
    const facebook::react::RNSScreenStackHeaderConfigState &previousState,
    folly::dynamic data) {}

folly::dynamic RNSScreenStackHeaderConfigState::getDynamic() const {
  return folly::dynamic::object();
}

MapBuffer RNSScreenStackHeaderConfigState::getMapBuffer() const {
  return MapBufferBuilder::EMPTY();
}
#endif // ANDROID

} // namespace facebook::react
