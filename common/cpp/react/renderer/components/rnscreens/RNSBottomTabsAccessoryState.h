#pragma once

#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>

namespace facebook::react {

class JSI_EXPORT RNSBottomTabsAccessoryState final {
 public:
  using Shared = std::shared_ptr<const RNSBottomTabsAccessoryState>;

  RNSBottomTabsAccessoryState() {};
  RNSBottomTabsAccessoryState(Size frameSize_, Point offset_)
      : frameSize(frameSize_), offset(offset_) {};

  const Size frameSize{};
  const Point offset{};
};

} // namespace facebook::react
