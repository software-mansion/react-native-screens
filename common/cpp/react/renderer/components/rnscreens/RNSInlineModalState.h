#pragma once

#ifndef ANDROID

#include <react/renderer/graphics/Geometry.h>

namespace facebook::react {

class JSI_EXPORT RNSInlineModalState final {
 public:
  using Shared = std::shared_ptr<const RNSInlineModalState>;

  RNSInlineModalState() = default;
  RNSInlineModalState(Size frameSize, Point contentOffset)
      : frameSize(frameSize), contentOffset(contentOffset) {}

  Size frameSize{};
  Point contentOffset{};
};

} // namespace facebook::react

#endif // ANDROID
