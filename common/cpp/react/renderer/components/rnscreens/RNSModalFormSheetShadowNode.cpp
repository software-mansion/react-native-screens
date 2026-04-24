#include "RNSModalFormSheetShadowNode.h"

namespace facebook::react {

extern const char RNSModalFormSheetComponentName[] = "RNSModalFormSheet";

Point RNSModalFormSheetShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  return getStateData().contentOriginOffset;
}

} // namespace facebook::react
