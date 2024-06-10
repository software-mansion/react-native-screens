#pragma once

#include <jsi/jsi.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSScreenStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenStackHeaderConfigState>;

  RNSScreenStackHeaderConfigState();

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      const RNSScreenStackHeaderConfigState &previousState,
      folly::dynamic data);

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const;
#endif
};

} // namespace facebook::react
