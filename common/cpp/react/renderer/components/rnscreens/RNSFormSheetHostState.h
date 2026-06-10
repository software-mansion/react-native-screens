#pragma once

#if !defined(ANDROID)

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSFormSheetHostState final {
 public:
  RNSFormSheetHostState() = default;
  RNSFormSheetHostState(Size frameSize, Point contentOffset)
      : frameSize(frameSize), contentOffset(contentOffset) {}

  Size frameSize{};
  Point contentOffset{};
};

} // namespace facebook::react

#endif // !defined(ANDROID)
