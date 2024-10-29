#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

class JSI_EXPORT RNSScreenStackHeaderConfigState final {
 public:
  using Shared = std::shared_ptr<const RNSScreenStackHeaderConfigState>;

  RNSScreenStackHeaderConfigState() = default;

  RNSScreenStackHeaderConfigState(Float paddingStart, Float paddingEnd, Float paddingTop)
    : paddingStart_{paddingStart}, paddingEnd_{paddingEnd}, paddingTop_{paddingTop} {}

#ifdef ANDROID
  RNSScreenStackHeaderConfigState(
      RNSScreenStackHeaderConfigState const &previousState,
      folly::dynamic data)
      : paddingStart_{static_cast<Float>(data["paddingStart"].getDouble())},
        paddingEnd_{static_cast<Float>(data["paddingEnd"].getDouble())} {}
#endif

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif

#pragma mark - Getters

  [[nodiscard]] Float getPaddingStart() const noexcept;

  [[nodiscard]] Float getPaddingEnd() const noexcept;
    
  [[nodiscard]] Float getPaddingTop() const noexcept;

 private:
  Float paddingStart_{0.f};
  Float paddingEnd_{0.f};
  Float paddingTop_{0.f};
};

} // namespace facebook::react
