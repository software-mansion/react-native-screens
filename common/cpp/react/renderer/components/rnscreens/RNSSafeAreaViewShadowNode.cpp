// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#include "RNSSafeAreaViewShadowNode.h"

#include <react/renderer/components/view/conversions.h>
#include <react/renderer/core/LayoutContext.h>
#include <yoga/Yoga.h>
#include <algorithm>

namespace facebook {
namespace react {

using namespace yoga;

extern const char RNSSafeAreaViewComponentName[] = "RNSSafeAreaView";

inline Style::Length valueFromEdges(
    Style::Length edge,
    Style::Length axis,
    Style::Length defaultValue) {
  if (edge.isDefined()) {
    return edge;
  }
  if (axis.isDefined()) {
    return axis;
  }
  return defaultValue;
}

inline float getEdgeValue(bool edgeMode, float insetValue, float edgeValue) {
  return edgeMode ? insetValue + edgeValue : edgeValue;
}

void RNSSafeAreaViewShadowNode::adjustLayoutWithState() {
  ensureUnsealed();

  auto &props = getConcreteProps();
  auto state =
      std::static_pointer_cast<const RNSSafeAreaViewShadowNode::ConcreteState>(
          getState());
  auto stateData = state->getData();
  auto edges = props.edges;

  // Get the current values for padding / margin. The only caveat here is that
  // percent values are not supported. Also might need to add support for start
  // / end.
  Style::Length top, left, right, bottom;

  auto defaultMargin = props.yogaStyle.margin(Edge::All);
  top = valueFromEdges(
      props.yogaStyle.margin(Edge::Top),
      props.yogaStyle.margin(Edge::Vertical),
      defaultMargin);
  left = valueFromEdges(
      props.yogaStyle.margin(Edge::Left),
      props.yogaStyle.margin(Edge::Horizontal),
      defaultMargin);
  bottom = valueFromEdges(
      props.yogaStyle.margin(Edge::Bottom),
      props.yogaStyle.margin(Edge::Vertical),
      defaultMargin);
  right = valueFromEdges(
      props.yogaStyle.margin(Edge::Right),
      props.yogaStyle.margin(Edge::Horizontal),
      defaultMargin);

  top = Style::Length::points(getEdgeValue(
      edges.top, stateData.insets.top, top.value().unwrapOrDefault(0)));
  left = Style::Length::points(getEdgeValue(
      edges.left, stateData.insets.left, left.value().unwrapOrDefault(0)));
  right = Style::Length::points(getEdgeValue(
      edges.right, stateData.insets.right, right.value().unwrapOrDefault(0)));
  bottom = Style::Length::points(getEdgeValue(
      edges.bottom,
      stateData.insets.bottom,
      bottom.value().unwrapOrDefault(0)));

  yoga::Style adjustedStyle = getConcreteProps().yogaStyle;
  adjustedStyle.setMargin(Edge::Top, top);
  adjustedStyle.setMargin(Edge::Left, left);
  adjustedStyle.setMargin(Edge::Right, right);
  adjustedStyle.setMargin(Edge::Bottom, bottom);

  auto currentStyle = yogaNode_.style();
  if (adjustedStyle.margin(Edge::Top) != currentStyle.margin(Edge::Top) ||
      adjustedStyle.margin(Edge::Left) != currentStyle.margin(Edge::Left) ||
      adjustedStyle.margin(Edge::Right) != currentStyle.margin(Edge::Right) ||
      adjustedStyle.margin(Edge::Bottom) != currentStyle.margin(Edge::Bottom)) {
    yogaNode_.setStyle(adjustedStyle);
    yogaNode_.setDirty(true);
  }
}

} // namespace react
} // namespace facebook
