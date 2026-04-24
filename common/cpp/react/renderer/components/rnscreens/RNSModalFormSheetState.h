#pragma once

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSModalFormSheetState final {
 public:
  using Shared = std::shared_ptr<const RNSModalFormSheetState>;

  RNSModalFormSheetState() = default;
  RNSModalFormSheetState(Size frameSize, Point contentOriginOffset)
      : frameSize(frameSize), contentOriginOffset(contentOriginOffset) {}

  Size frameSize{};
  Point contentOriginOffset{};
};

} // namespace facebook::react
