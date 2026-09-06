#pragma once

#if defined(ANDROID)
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

namespace facebook::react {

class JSI_EXPORT RNSFullWindowOverlayState final {
 public:
  using Shared = std::shared_ptr<const RNSFullWindowOverlayState>;

  RNSFullWindowOverlayState() = default;

#if defined(ANDROID)
  RNSFullWindowOverlayState(
      const RNSFullWindowOverlayState &previousState,
      folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
