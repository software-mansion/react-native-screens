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
            auto topInsetOffset = stateData.getPaddingTop();
            return {0, topInsetOffset};
        }
    }
}
