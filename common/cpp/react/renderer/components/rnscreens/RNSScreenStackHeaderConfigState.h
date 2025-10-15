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

#if !defined(ANDROID)
  RNSScreenStackHeaderConfigState(Size frameSize_, EdgeInsets edgeInsets_)
      : frameSize{frameSize_}, edgeInsets{edgeInsets_} {}

  // Make it copyable
  RNSScreenStackHeaderConfigState(const RNSScreenStackHeaderConfigState &source)
      : frameSize{source.frameSize}, edgeInsets{source.edgeInsets} {}
  RNSScreenStackHeaderConfigState &operator=(
      const RNSScreenStackHeaderConfigState &source) {
    this->frameSize.width = source.frameSize.width;
    this->frameSize.height = source.frameSize.height;
    this->edgeInsets = source.edgeInsets;
    return *this;
  }

  bool operator==(const RNSScreenStackHeaderConfigState &other) {
    return this->frameSize == other.frameSize &&
        this->edgeInsets == other.edgeInsets;
  }

  bool operator!=(const RNSScreenStackHeaderConfigState &other) {
    return this->frameSize != other.frameSize ||
        this->edgeInsets != other.edgeInsets;
  }
#endif

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      RNSScreenStackHeaderConfigState const &previousState,
      folly::dynamic data)
      : frameSize{
          static_cast<Float>(data["frameWidth"].getDouble()),
          static_cast<Float>(data["frameHeight"].getDouble())
        },
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
  void setImageLoader(std::weak_ptr<void> imageLoader);
  std::weak_ptr<void> getImageLoader() const noexcept;
#endif // ANDROID

  Size frameSize{};

#if !defined(ANDROID)
  EdgeInsets edgeInsets{}; // zero initialized
#endif

#ifdef ANDROID
  Float paddingStart{0.f};
  Float paddingEnd{0.f};
#endif // ANDROID

#pragma mark - Getters

 private:
#if !defined(ANDROID)
  std::weak_ptr<void> imageLoader_;
#endif // !ANDROID
};

} // namespace facebook::react
