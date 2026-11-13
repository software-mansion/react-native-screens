#include "RNSStackHostShadowNode.h"

namespace facebook::react {

extern const char RNSStackHostComponentName[] = "RNSStackHost";

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : ConcreteViewShadowNode(fragment, family, traits) {
#if !defined(ANDROID)
  updateDisplayForExternalNavigationController();
#endif // !defined(ANDROID)
}

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : ConcreteViewShadowNode(sourceShadowNode, fragment) {
#if !defined(ANDROID)
  updateDisplayForExternalNavigationController();
#endif // !defined(ANDROID)
}

#if !defined(ANDROID)
/**
 * A host that uses an external navigation controller is out of layout.
 * However, the host still needs its view, which receives the screens
 * and operates on the navigation controller.
 *
 * React Native marks every node rendered with `display: contents` for
 * flattening (`ForceFlattenView`) when it applies the style. Inside a Split
 * column `Stack.Host` renders that way and still needs its view, which
 * owns the navigation controller the Split installs in the column so the mark
 * is cleared after every construction.
 */
void RNSStackHostShadowNode::updateDisplayForExternalNavigationController() {
  const auto &props = getConcreteProps();
  auto style = yogaNode_.style();
  auto display = props.usesExternalNavigationController
      ? yoga::Display::Contents
      : props.yogaStyle.display();
  if (style.display() != display) {
    style.setDisplay(display);
    yogaNode_.setStyle(style);
    yogaNode_.setDirty(true);
  }

  if (display == yoga::Display::Contents) {
    traits_.unset(ShadowNodeTraits::Trait::ForceFlattenView);
  }
}
#endif // !defined(ANDROID)

} // namespace facebook::react
