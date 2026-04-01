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

class JSI_EXPORT RNSStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSStackHeaderConfigState>;

  RNSStackHeaderConfigState() {}

#ifdef ANDROID
  RNSStackHeaderConfigState(
      RNSStackHeaderConfigState const &previousState,
      folly::dynamic data)
      : frameSize(
            Size{
                (Float)data["frameWidth"].getDouble(),
                (Float)data["frameHeight"].getDouble()}),
        contentOffset(
            Point{
                (Float)data["contentOffsetX"].getDouble(),
                (Float)data["contentOffsetY"].getDouble()}) {}

  Size frameSize{};
  Point contentOffset{};

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  }
#endif // ANDROID
};

} // namespace facebook::react
