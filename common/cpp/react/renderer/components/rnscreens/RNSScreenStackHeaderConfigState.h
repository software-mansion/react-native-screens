#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSScreenStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenStackHeaderConfigState>;

  RNSScreenStackHeaderConfigState() = default;

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      RNSScreenStackHeaderConfigState const &previousState,
      folly::dynamic data) {}
#endif

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif

#pragma mark - Getters
};

} // namespace facebook::react
