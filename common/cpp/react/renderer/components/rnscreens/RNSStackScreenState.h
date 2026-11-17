#pragma once

#include <jsi/jsi.h>
#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID

namespace facebook::react {

class JSI_EXPORT RNSStackScreenState final {
 public:
  using Shared = std::shared_ptr<const RNSStackScreenState>;

  RNSStackScreenState() {};
  RNSStackScreenState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_) {};

  Size frameSize{};
  Point contentOffset{};

#ifdef ANDROID
  RNSStackScreenState(
      RNSStackScreenState const &previousState,
      folly::dynamic data)
      : frameSize(
            Size{
                (Float)data["frameWidth"].getDouble(),
                (Float)data["frameHeight"].getDouble()}),
        contentOffset(
            Point{
                (Float)data["contentOffsetX"].getDouble(),
                (Float)data["contentOffsetY"].getDouble()}) {};

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif // ANDROID
};

} // namespace facebook::react
