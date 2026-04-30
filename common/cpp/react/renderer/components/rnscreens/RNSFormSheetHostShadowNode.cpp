#include "RNSFormSheetHostShadowNode.h"

#if !defined(ANDROID)

namespace facebook::react {

extern const char RNSFormSheetHostComponentName[] = "RNSFormSheetHost";

Point RNSFormSheetHostShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

} // namespace facebook::react

#endif // !defined(ANDROID)
