#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";
}

namespace facebook {
    namespace  react {
        Point RNSScreenStackHeaderConfigShadowNode::getContentOriginOffset(
                bool /*includeTransform*/) const {
            auto stateData = getStateData();
            auto paddingTop = stateData.getPaddingTop();
            return {0, paddingTop};
        }
    }
}
