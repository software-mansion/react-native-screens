#pragma once

#ifndef ANDROID

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSFormSheetState final {
 public:
  using Shared = std::shared_ptr<const RNSFormSheetState>;

  RNSFormSheetState() = default;
  RNSFormSheetState(Size frameSize, Point contentOffset)
      : frameSize(frameSize), contentOffset(contentOffset) {}

  Size frameSize{};
  Point contentOffset{};
};

} // namespace facebook::react

#endif // ANDROID
