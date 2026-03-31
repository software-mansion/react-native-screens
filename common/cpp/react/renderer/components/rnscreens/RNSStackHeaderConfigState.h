#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

namespace facebook::react {

class JSI_EXPORT RNSStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSStackHeaderConfigState>;

  RNSStackHeaderConfigState() = default;

  RNSStackHeaderConfigState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_) {};

  const Size frameSize{};
  const Point contentOffset{};
};

} // namespace facebook::react
