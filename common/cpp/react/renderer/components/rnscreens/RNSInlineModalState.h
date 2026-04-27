#pragma once

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSInlineModalState final {
 public:
  using Shared = std::shared_ptr<const RNSInlineModalState>;

  RNSInlineModalState() = default;
  RNSInlineModalState(Size frameSize) : frameSize(frameSize) {}

  Size frameSize{};
};

} // namespace facebook::react
