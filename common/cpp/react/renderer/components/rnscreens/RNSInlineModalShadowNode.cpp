#include "RNSInlineModalShadowNode.h"

namespace facebook::react {

extern const char RNSInlineModalComponentName[] = "RNSInlineModal";

Point RNSInlineModalShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOriginOffset;
}

} // namespace facebook::react
