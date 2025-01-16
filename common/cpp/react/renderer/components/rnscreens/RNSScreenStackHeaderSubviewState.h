#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

#include "FrameCorrectionModes.h"

namespace facebook::react {

using namespace rnscreens;

class JSI_EXPORT RNSScreenStackHeaderSubviewState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenStackHeaderSubviewState>;

  RNSScreenStackHeaderSubviewState() = default;

  RNSScreenStackHeaderSubviewState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_){};

#ifdef ANDROID
  RNSScreenStackHeaderSubviewState(
      RNSScreenStackHeaderSubviewState const &previousState,
      folly::dynamic data)
      : frameSize(Size{
            (Float)data["frameWidth"].getDouble(),
            (Float)data["frameHeight"].getDouble()}),
        contentOffset(Point{
            (Float)data["contentOffsetX"].getDouble(),
            (Float)data["contentOffsetY"].getDouble()}) {}
#endif // ANDROID

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif // ANDROID

  const Size frameSize{};
  Point contentOffset{};

#pragma mark - Getters
};

} // namespace facebook::react
