#include "RNSBottomTabsShadowNode.h"

namespace facebook::react {

extern const char RNSBottomTabsComponentName[] = "RNSBottomTabs";

#if !defined(ANDROID)
void RNSBottomTabsShadowNode::setImageLoader(std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

RNSBottomTabsShadowNode::StateData &
RNSBottomTabsShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSBottomTabsShadowNode::StateData &>(getStateData());
}
#endif // !ANDROID
} // namespace facebook::react
