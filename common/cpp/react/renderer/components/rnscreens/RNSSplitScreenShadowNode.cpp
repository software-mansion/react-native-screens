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

/**
 * True when the node is a `Stack.Host` that operates on the navigation
 * controller of the column instead of creating its own.
 */
static bool isStackHostOfColumn(const ShadowNode &node) {
  if (std::strcmp(node.getComponentName(), "RNSStackHost") != 0) {
    return false;
  }
  const auto &props = static_cast<const RNSStackHostProps &>(*node.getProps());
  return props.usesExternalNavigationController;
}

/**
 * True when the only direct child of the column is such a `Stack.Host`. A view
 * in between, or another child next to it, leaves the column a plain one.
 */
static bool hostsStack(const ShadowNode &column) {
  const auto &children = column.getChildren();
  return children.size() == 1 && isStackHostOfColumn(*children[0]);
}

/**
 * A column that hosts a stack is out of layout. However, the column still
 * needs its view, which gives its navigation controller to the host.
 *
 * React Native marks every node rendered with `display: contents` for
 * flattening (`ForceFlattenView`). A column that hosts a stack renders that
 * way and still needs its view, so the mark is cleared after every
 * construction.
 */
void RNSSplitScreenShadowNode::updateDisplayForContent() {
  auto style = yogaNode_.style();
  auto display = hostsStack(*this) ? yoga::Display::Contents
                                   : getConcreteProps().yogaStyle.display();
  if (style.display() != display) {
    style.setDisplay(display);
    yogaNode_.setStyle(style);
    yogaNode_.setDirty(true);
  }

  if (display == yoga::Display::Contents) {
    traits_.unset(ShadowNodeTraits::Trait::ForceFlattenView);
  }
}

Point RNSSplitScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  // Out of layout the column has no frame of its own. The offset reported
  // while it was a plain column must not shift the screens of the stack, which
  // carry their own.
  if (yogaNode_.style().display() == yoga::Display::Contents) {
    return {};
  }
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
