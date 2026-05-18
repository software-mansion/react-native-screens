#pragma once

#include <jsi/jsi.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID
#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

namespace facebook::react {

class JSI_EXPORT RNSStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSStackHeaderConfigState>;

  RNSStackHeaderConfigState() {}

  Size frameSize{};
  Point contentOffset{};

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

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  }
#else // ANDROID
  RNSStackHeaderConfigState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_) {};
#endif // ANDROID
};

} // namespace facebook::react
