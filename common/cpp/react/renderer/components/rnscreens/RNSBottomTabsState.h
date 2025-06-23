#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSBottomTabsState final {
 public:
  using Shared = std::shared_ptr<const RNSBottomTabsState>;

  RNSBottomTabsState() = default;

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#else // ANDROID
#if !defined(NDEBUG)
  void setImageLoader(std::weak_ptr<void> imageLoader);
  std::weak_ptr<void> getImageLoader() const noexcept;
#endif // !NDEBUG
#endif // ANDROID

#pragma mark - Getters

 private:
#if !defined(ANDROID) && !defined(NDEBUG)
  std::weak_ptr<void> imageLoader_;
#endif // !ANDROID && !NDEBUG
};

} // namespace facebook::react
