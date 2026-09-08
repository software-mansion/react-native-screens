#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSTabsHostState final {
 public:
  using Shared = std::shared_ptr<const RNSTabsHostState>;

  RNSTabsHostState() = default;

#ifdef ANDROID
  RNSTabsHostState(RNSTabsHostState const &previousState, folly::dynamic data) {
  }
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

#pragma mark - Getters

 private:
#if !defined(ANDROID)
  std::weak_ptr<void> imageLoader_;
#endif // !ANDROID
};

} // namespace facebook::react
