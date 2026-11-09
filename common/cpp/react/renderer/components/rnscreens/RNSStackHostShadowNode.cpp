#include "RNSStackHostShadowNode.h"

namespace facebook::react {

extern const char RNSStackHostComponentName[] = "RNSStackHost";

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNodeFragment &fragment,
    const ShadowNodeFamily::Shared &family,
    ShadowNodeTraits traits)
    : ConcreteViewShadowNode(fragment, family, traits) {
  unsetForceFlattenViewForContents();
}

RNSStackHostShadowNode::RNSStackHostShadowNode(
    const ShadowNode &sourceShadowNode,
    const ShadowNodeFragment &fragment)
    : ConcreteViewShadowNode(sourceShadowNode, fragment) {
  unsetForceFlattenViewForContents();
}

/**
 * React Native marks every node rendered with `display: contents` for
 * flattening (`ForceFlattenView`) when it applies the style. Inside a Split 
 * column `Stack.Host` renders that way and still needs its view, 
 * which owns the navigation controller the Split installs in
 * the column, so the mark is cleared after every construction.
 */
void RNSStackHostShadowNode::unsetForceFlattenViewForContents() {
#if !defined(ANDROID)
  if (yogaNode_.style().display() == yoga::Display::Contents) {
    traits_.unset(ShadowNodeTraits::Trait::ForceFlattenView);
  }
#endif // !defined(ANDROID)
}

} // namespace facebook::react
