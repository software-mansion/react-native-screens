#pragma once

#include <jsi/jsi.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID

namespace facebook::react {

class JSI_EXPORT RNSStackHeaderSubviewState final {
 public:
  using Shared = std::shared_ptr<const RNSStackHeaderSubviewState>;

  RNSStackHeaderSubviewState() {}

#ifdef ANDROID
  RNSStackHeaderSubviewState(
      RNSStackHeaderSubviewState const &previousState,
      folly::dynamic data)
      : contentOffset(
            Point{
                (Float)data["contentOffsetX"].getDouble(),
                (Float)data["contentOffsetY"].getDouble()}) {}

  Point contentOffset{};

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  }
#endif // ANDROID
};

} // namespace facebook::react
