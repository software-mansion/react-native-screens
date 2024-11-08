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

#ifdef ANDROID
  RNSScreenStackHeaderSubviewState(
      RNSScreenStackHeaderSubviewState const &previousState,
      folly::dynamic data) {}
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
#endif // NDEBUG
#endif // ANDROID

 private:
#ifdef ANDROID
#else // ANDROID
#ifndef NDEBUG
  std::weak_ptr<void> imageLoader_;
#endif // NDEBUG
#endif // ANDROID
#pragma mark - Getters
};

} // namespace facebook::react
