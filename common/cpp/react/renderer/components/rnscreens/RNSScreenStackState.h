#pragma once

#include <jsi/jsi.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSScreenStackState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenStackState>;

  RNSScreenStackState();

#ifdef ANDROID
  RNSScreenStackState(const RNSScreenStackState &previousState, folly::dynamic data);

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const;
#endif
};

}
