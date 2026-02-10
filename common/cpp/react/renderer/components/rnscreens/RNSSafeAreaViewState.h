// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

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

/*
 * State for <RNSSafeAreaView> component.
 */
class JSI_EXPORT RNSSafeAreaViewState final {
 public:
  using Shared = std::shared_ptr<const RNSSafeAreaViewState>;

  RNSSafeAreaViewState() {};
  RNSSafeAreaViewState(EdgeInsets insets_) : insets(insets_) {};

#ifdef ANDROID
  RNSSafeAreaViewState(
      RNSSafeAreaViewState const &previousState,
      folly::dynamic data)
      : insets(edgeInsetsFromDynamic(data["insets"])) {};
#endif

  EdgeInsets insets{};

#ifdef ANDROID
  inline EdgeInsets edgeInsetsFromDynamic(const folly::dynamic &value) {
    return EdgeInsets{
        .left = (float)value["left"].getDouble(),
        .top = (float)value["top"].getDouble(),
        .right = (float)value["right"].getDouble(),
        .bottom = (float)value["bottom"].getDouble(),
    };
  }
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif
};

} // namespace react
} // namespace facebook
