#pragma once

// The ContainedModal component family is iOS-only. The Android build compiles
// every source in this directory, so the whole translation unit is guarded out
// there - no codegen props/emitters exist for it on Android.
#if !defined(ANDROID)

#include <jsi/jsi.h>
#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>

namespace facebook::react {

class JSI_EXPORT RNSContainedModalHostState final {
 public:
  RNSContainedModalHostState() = default;
  RNSContainedModalHostState(Size frameSize, Point contentOffset)
      : frameSize(frameSize), contentOffset(contentOffset) {}

  Size frameSize{};
  Point contentOffset{};
};

} // namespace facebook::react

#endif // !defined(ANDROID)
