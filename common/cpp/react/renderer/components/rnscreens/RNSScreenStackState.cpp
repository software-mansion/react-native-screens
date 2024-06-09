#include "RNSScreenStackState.h"

namespace facebook::react {

RNSScreenStackState::RNSScreenStackState() {}

#ifdef ANDROID
RNSScreenStackState::RNSScreenStackState(const facebook::react::RNSScreenStackState &previousState, folly::dynamic data) {}

folly::dynamic RNSScreenStackState::getDynamic() const {
  return folly::dynamic::object();
}

MapBuffer RNSScreenStackState::getMapBuffer() const {
  return MapBufferBuilder::EMPTY();
}
#endif // ANDROID

}
