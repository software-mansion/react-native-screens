#include "RNSSplitScreenShadowNode.h"

#include <cstring>

namespace facebook::react {

extern const char RNSSplitScreenComponentName[] = "RNSSplitScreen";

void RNSSplitScreenShadowNode::appendChild(
    const std::shared_ptr<const ShadowNode> &child) {
  ConcreteViewShadowNode::appendChild(child);
  configureStackIntegrationIfNeeded();
}

/**
 * True when the node is a `Stack.Host` in headless mode.
 */
static bool isStackHostOfColumn(const ShadowNode &node) {
  if (std::strcmp(node.getComponentName(), "RNSStackHost") != 0) {
    return false;
  }
  const auto &props = static_cast<const RNSStackHostProps &>(*node.getProps());
  return props.headlessModeEnabled;
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
 * needs its view, which the host of the stack is mounted in.
 *
 * React Native marks every node rendered with `display: contents` for
 * flattening (`ForceFlattenView`). A column that hosts a stack renders that
 * way and still needs its view, so the mark is cleared after every
 * construction.
 */
void RNSSplitScreenShadowNode::configureStackIntegrationIfNeeded() {
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
  // The offset applies also while the column is out of layout. The screens of
  // the stack it hosts take their position from it then.
  auto stateData = getStateData();
  return stateData.contentOffset;
}

} // namespace facebook::react
