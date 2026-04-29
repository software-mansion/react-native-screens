#include "RNSFormSheetShadowNode.h"

#ifndef ANDROID

namespace facebook::react {

extern const char RNSFormSheetComponentName[] = "RNSFormSheet";

Point RNSFormSheetShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOffset;
}

} // namespace facebook::react

#endif // ANDROID
