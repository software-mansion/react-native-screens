#include "RNSScreenStackHeaderConfigShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderConfigComponentName[] =
    "RNSScreenStackHeaderConfig";

#if !defined(ANDROID) && !defined(NDEBUG)
void RNSScreenStackHeaderConfigShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}
RNSScreenStackHeaderConfigShadowNode::StateData &
RNSScreenStackHeaderConfigShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSScreenStackHeaderConfigShadowNode::StateData &>(
      getStateData());
}
#endif // !ANDROID && !NDEBUG
} // namespace facebook::react
