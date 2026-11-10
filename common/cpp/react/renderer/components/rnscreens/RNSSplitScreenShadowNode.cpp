#include "RNSSplitScreenShadowNode.h"

#include <cstring>

namespace facebook::react {

extern const char RNSSplitScreenComponentName[] = "RNSSplitScreen";

RNSSplitScreenShadowNode::RNSSplitScreenShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : ConcreteViewShadowNode(fragment, family, traits) {
  updateDisplayForContent();
}

RNSSplitScreenShadowNode::RNSSplitScreenShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : ConcreteViewShadowNode(sourceShadowNode, fragment) {
  updateDisplayForContent();
}

void RNSSplitScreenShadowNode::appendChild(
    const std::shared_ptr<const ShadowNode> &child) {
  ConcreteViewShadowNode::appendChild(child);
  updateDisplayForContent();
}

static bool isStackHost(const ShadowNode &node) {
  return std::strcmp(node.getComponentName(), "RNSStackHost") == 0;
}

/**
 * True when the only direct child of the column is a `Stack.Host`. A view in
 * between leaves the column a plain one.
 */
static bool hostsStack(const ShadowNode &column) {
  const auto &children = column.getChildren();
  return children.size() == 1 && isStackHost(*children[0]);
}

/**
 * A column whose only content is a `Stack.Host` is out of layout. The host's 
 * screens are laid out as children of the split host and take the column frame
 * from their state. The column keeps its view, which hands the host's navigation
 * controller to the Split. `disableStackIntegration` keeps the column in layout
 * regardless.
 */
void RNSSplitScreenShadowNode::updateDisplayForContent() {
  const auto &props = getConcreteProps();
  auto style = yogaNode_.style();
  auto display = !props.disableStackIntegration && hostsStack(*this)
      ? yoga::Display::Contents
      : props.yogaStyle.display();
  if (style.display() == display) {
    return;
  }
  style.setDisplay(display);
  yogaNode_.setStyle(style);
  yogaNode_.setDirty(true);
}

Point RNSSplitScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  // Out of layout the column has no frame of its own; the offset reported
  // while it was a plain column must not shift the stack screens, which
  // carry their own.
  if (yogaNode_.style().display() == yoga::Display::Contents) {
    return {};
  }
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
