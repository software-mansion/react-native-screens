#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

namespace facebook::react {

class JSI_EXPORT RNSFullWindowOverlayState final {
 public:
  using Shared = std::shared_ptr<const RNSFullWindowOverlayState>;

  RNSFullWindowOverlayState() = default;

  RNSFullWindowOverlayState(Point contentOffset_)
      : contentOffset{contentOffset_} {}

  /// Content offset caused by view flattening
  Point contentOffset{};
};

} // namespace facebook::react
