#include "RNSTabsHostShadowNode.h"

namespace facebook::react {

extern const char RNSTabsHostComponentName[] = "RNSTabsHost";

#if !defined(ANDROID)
void RNSTabsHostShadowNode::setImageLoader(std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

RNSTabsHostShadowNode::StateData &RNSTabsHostShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSTabsHostShadowNode::StateData &>(getStateData());
}
#endif // !ANDROID
} // namespace facebook::react
