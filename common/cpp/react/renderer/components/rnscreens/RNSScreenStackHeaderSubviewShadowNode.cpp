#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

extern const char RNSScreenStackHeaderSubviewComponentName[] =
    "RNSScreenStackHeaderSubview";

#ifdef ANDROID
#else // ANDROID
#ifndef NDEBUG
void RNSScreenStackHeaderSubviewShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}
RNSScreenStackHeaderSubviewShadowNode::StateData &
RNSScreenStackHeaderSubviewShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSScreenStackHeaderSubviewShadowNode::StateData &>(
      getStateData());
}
#endif // NDEBUG
#endif // ANDROID
} // namespace facebook::react
