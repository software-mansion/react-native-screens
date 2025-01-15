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

  RNSScreenStackHeaderConfigState(
      Size frameSize_,
      Point contentOffset_,
      Float paddingStart_,
      Float paddingEnd_)
      : frameSize{frameSize_},
        contentOffset{contentOffset_},
        paddingStart{paddingStart_},
        paddingEnd{paddingEnd_} {}

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      RNSScreenStackHeaderConfigState const &previousState,
      folly::dynamic data)
      : frameSize{
          static_cast<Float>(data["frameWidth"].getDouble()),
          static_cast<Float>(data["frameHeight"].getDouble())
        },
        contentOffset{previousState.contentOffset},
        paddingStart{static_cast<Float>(data["paddingStart"].getDouble())},
        paddingEnd{static_cast<Float>(data["paddingEnd"].getDouble())}
        {}
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
  Point contentOffset{};
  Float paddingStart{0.f};
  Float paddingEnd{0.f};

#pragma mark - Getters

 private:
#if !defined(ANDROID) && !defined(NDEBUG)
  std::weak_ptr<void> imageLoader_;
#endif // !ANDROID && !NDEBUG
};

} // namespace facebook::react
