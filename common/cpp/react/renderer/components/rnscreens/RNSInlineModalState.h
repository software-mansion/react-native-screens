#pragma once

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSInlineModalState final {
 public:
  using Shared = std::shared_ptr<const RNSInlineModalState>;

  RNSInlineModalState() = default;
  RNSInlineModalState(Size frameSize, Point contentOriginOffset)
      : frameSize(frameSize), contentOriginOffset(contentOriginOffset) {}

  Size frameSize{};
  Point contentOriginOffset{};
};

} // namespace facebook::react
