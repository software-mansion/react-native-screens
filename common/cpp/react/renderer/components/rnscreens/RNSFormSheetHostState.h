#pragma once

#include <jsi/jsi.h>
#include <react/renderer/graphics/Float.h>
#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>
#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID

namespace facebook::react {

class JSI_EXPORT RNSFormSheetHostState final {
 public:
  RNSFormSheetHostState() = default;
  RNSFormSheetHostState(Size frameSize, Point contentOffset)
      : frameSize(frameSize), contentOffset(contentOffset) {}

#ifdef ANDROID
  RNSFormSheetHostState(
      RNSFormSheetHostState const &previousState,
      folly::dynamic const &data)
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
#endif // ANDROID

  Size frameSize{};
  Point contentOffset{};
};

} // namespace facebook::react
