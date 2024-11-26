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

  RNSScreenStackHeaderConfigState(Size frameSize_, Point contentOffset_)
    : frameSize(frameSize_), contentOffset(contentOffset_) {}

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      RNSScreenStackHeaderConfigState const &previousState,
      folly::dynamic data)
      : frameSize(Size{
          (Float)data["frameWidth"].getDouble(),
          (Float)data["frameHeight"].getDouble()}),
        contentOffset(Point{
          (Float)data["contentOffsetX"].getDouble(),
          (Float)data["contentOffsetY"].getDouble()}){}
#endif

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#else // ANDROID
#ifndef NDEBUG
  void setImageLoader(std::weak_ptr<void> imageLoader);
  std::weak_ptr<void> getImageLoader() const noexcept;
#endif // !NDEBUG
#endif // ANDROID

  const Size frameSize{};
  Point contentOffset;

#pragma mark - Getters

 private:
#if !defined(ANDROID) && !defined(NDEBUG)
  std::weak_ptr<void> imageLoader_;
#endif // !ANDROID && !NDEBUG
};

} // namespace facebook::react
