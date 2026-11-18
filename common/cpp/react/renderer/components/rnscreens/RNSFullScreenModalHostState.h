#pragma once

#if !defined(ANDROID)

#include <jsi/jsi.h>
#include <react/renderer/graphics/Size.h>

namespace facebook::react {

class JSI_EXPORT RNSFullScreenModalHostState final {
 public:
  RNSFullScreenModalHostState() = default;
  explicit RNSFullScreenModalHostState(Size frameSize) : frameSize(frameSize) {}

  Size frameSize{};
};

} // namespace facebook::react

#endif // !defined(ANDROID)
