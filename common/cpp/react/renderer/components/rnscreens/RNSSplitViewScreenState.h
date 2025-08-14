#pragma once

#if defined(ANDROID)
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif // ANDROID

namespace facebook::react {

class JSI_EXPORT RNSSplitViewScreenState final {
 public:
  using Shared = std::shared_ptr<const RNSSplitViewScreenState>;

  RNSSplitViewScreenState() {};
  RNSSplitViewScreenState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_) {};

  const Size frameSize{};
  const Point contentOffset{};

#if defined(ANDROID)
  RNSSplitViewScreenState(
      const RNSSplitViewScreenState &previousState,
      folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
