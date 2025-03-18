#include "RNSModalScreenShadowNode.h"

namespace facebook {
namespace react {

extern const char RNSModalScreenComponentName[] = "RNSModalScreen";

Point RNSModalScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

} // namespace react
} // namespace facebook
