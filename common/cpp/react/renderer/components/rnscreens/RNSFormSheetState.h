#pragma once

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSFormSheetState final {
 public:
  using Shared = std::shared_ptr<const RNSFormSheetState>;

  RNSFormSheetState() = default;
  RNSFormSheetState(Size frameSize, Point contentOriginOffset)
      : frameSize(frameSize), contentOriginOffset(contentOriginOffset) {}

  Size frameSize{};
  Point contentOriginOffset{};
};

} // namespace facebook::react
