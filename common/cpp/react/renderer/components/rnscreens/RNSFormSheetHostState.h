#pragma once

#include <jsi/jsi.h>
#include <react/renderer/graphics/Float.h>
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
  RNSFormSheetHostState(Size frameSize) : frameSize(frameSize) {}

#ifdef ANDROID
  RNSFormSheetHostState(
      RNSFormSheetHostState const &previousState,
      folly::dynamic const &data)
      : frameSize(
            Size{
                (Float)data["frameWidth"].getDouble(),
                (Float)data["frameHeight"].getDouble()}) {}

  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  }
#endif // ANDROID

  Size frameSize{};
};

} // namespace facebook::react
