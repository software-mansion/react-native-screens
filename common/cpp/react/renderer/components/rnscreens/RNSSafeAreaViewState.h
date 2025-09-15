// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/common/cpp/react/renderer/components/safeareacontext/RNCSafeAreaViewState.h
#pragma once

#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/graphics/RectangleEdges.h>
#include <vector>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook {
namespace react {

#ifdef ANDROID
inline EdgeInsets RNS_edgeInsetsFromDynamic(const folly::dynamic &value) {
  return EdgeInsets{
      .left = (float)value["left"].getDouble(),
      .top = (float)value["top"].getDouble(),
      .right = (float)value["right"].getDouble(),
      .bottom = (float)value["bottom"].getDouble(),
  };
}

#endif

/*
 * State for <RNSSafeAreaView> component.
 */
class JSI_EXPORT RNSSafeAreaViewState final {
 public:
  using Shared = std::shared_ptr<const RNSSafeAreaViewState>;

  RNSSafeAreaViewState() {};

#ifdef ANDROID
  RNSSafeAreaViewState(
      RNSSafeAreaViewState const &previousState,
      folly::dynamic data)
      : insets(RNS_edgeInsetsFromDynamic(data["insets"])) {};
#endif

  EdgeInsets insets{};

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif
};

} // namespace react
} // namespace facebook
