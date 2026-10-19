#pragma once

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
