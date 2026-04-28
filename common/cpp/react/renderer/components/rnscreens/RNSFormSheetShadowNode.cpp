#include "RNSFormSheetShadowNode.h"

namespace facebook::react {

extern const char RNSFormSheetComponentName[] = "RNSFormSheet";

Point RNSFormSheetShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOriginOffset;
}

} // namespace facebook::react
