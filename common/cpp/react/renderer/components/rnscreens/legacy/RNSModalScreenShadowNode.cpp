#include "RNSModalScreenShadowNode.h"

namespace facebook {
namespace react {

extern const char RNSModalScreenComponentName[] = "RNSModalScreen";

Point RNSModalScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

Transform RNSModalScreenShadowNode::getTransform() const {
  auto viewportOffset = getStateData().viewportOffset;
  return Transform::Translate(viewportOffset.x, viewportOffset.y, 0) *
      ConcreteViewShadowNode::getTransform();
}

} // namespace react
} // namespace facebook
