#include "RNSStackHostShadowNode.h"

namespace facebook::react {

extern const char RNSStackHostComponentName[] = "RNSStackHost";

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : ConcreteViewShadowNode(fragment, family, traits) {
#if !defined(ANDROID)
  updateDisplayForHeadlessMode();
#endif // !defined(ANDROID)
}

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : ConcreteViewShadowNode(sourceShadowNode, fragment) {
#if !defined(ANDROID)
  updateDisplayForHeadlessMode();
#endif // !defined(ANDROID)
}

#if !defined(ANDROID)
/**
 * A host in headless mode is out of layout. However, the host still needs its
 * view, which receives the screens.
 *
 * React Native marks every node rendered with `display: contents` for
 * flattening (`ForceFlattenView`) when it applies the style, so the mark is
 * cleared after every construction.
 */
void RNSStackHostShadowNode::updateDisplayForHeadlessMode() {
  const auto &props = getConcreteProps();
  auto style = yogaNode_.style();
  auto display = props.headlessModeEnabled ? yoga::Display::Contents
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
