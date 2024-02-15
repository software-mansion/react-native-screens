#pragma once

#include <react/renderer/graphics/Float.h>
#include <react/renderer/core/graphicsConversions.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook {
namespace react {

class JSI_EXPORT RNSScreenState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenState>;

  RNSScreenState(){};
  RNSScreenState(Point contentOffset_) : contentOffset(contentOffset_){};

#ifdef ANDROID
  RNSScreenState(
      RNSScreenState const &previousState,
      folly::dynamic data)
      : contentOffset(Point{
          (Float)data["contentOffsetX"].getDouble(),
          (Float)data["contentOffsetY"].getDouble()})
    {};
#endif

    const Point contentOffset;

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif

#pragma mark - Getters
};

} // namespace react
} // namespace facebook
