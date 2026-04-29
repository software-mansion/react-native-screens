#include "RNSInlineModalShadowNode.h"

#ifndef ANDROID

namespace facebook::react {

extern const char RNSInlineModalComponentName[] = "RNSInlineModal";

Point RNSInlineModalShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

} // namespace facebook::react

#endif // ANDROID
