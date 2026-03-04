#include "RNSTabsHostShadowNode.h"

namespace facebook::react {

#if !defined(ANDROID)
extern const char RNSTabsHostComponentName[] = "RNSTabsHostIOS";
#else // !defined(ANDROID)
extern const char RNSTabsHostComponentName[] = "RNSTabsHostAndroid";
#endif // !defined(ANDROID)

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
#endif // !defined(ANDROID)
} // namespace facebook::react
