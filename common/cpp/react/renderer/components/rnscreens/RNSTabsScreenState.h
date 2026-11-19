#pragma once

#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>

namespace facebook::react {

// UIKit, rather than the window-sized tabs host, owns each tab's content frame.
class JSI_EXPORT RNSTabsScreenState final {
 public:
  RNSTabsScreenState() = default;
  RNSTabsScreenState(Size frameSize_, Point contentOffset_)
      : frameSize(frameSize_), contentOffset(contentOffset_) {}

  const Size frameSize{};
  const Point contentOffset{};
};

} // namespace facebook::react
