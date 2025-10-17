#include "RNSScreenShadowNodeCommitHook.h"
#include <react/fabric/FabricUIManagerBinding.h>
#include <react/fabric/JFabricUIManager.h>
#include <react/renderer/scheduler/Scheduler.h>
#include "RNSScreenComponentDescriptor.h"

namespace facebook {
namespace react {

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    std::shared_ptr<const ContextContainer> contextContainer,
    RNSScreenComponentDescriptor *screenComponentDescriptor)
    : contextContainer_(contextContainer),
      screenComponentDescriptor_(screenComponentDescriptor) {
  if (contextContainer_) {
    auto fabricUIManager = contextContainer_->at<jni::alias_ref<
        jni::detail::JTypeFor<JFabricUIManager, jni::JObject, void>::_javaobject
            *>>("FabricUIManager");
    auto uiManager =
        fabricUIManager->getBinding()->getScheduler()->getUIManager();
    uiManager->registerCommitHook(*this);
  }
}

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    const RNSScreenShadowNodeCommitHook &other) {
  contextContainer_ = other.contextContainer_;
  screenComponentDescriptor_ = other.screenComponentDescriptor_;
}

RNSScreenShadowNodeCommitHook::~RNSScreenShadowNodeCommitHook() noexcept {
  if (contextContainer_) {
    auto fabricUIManager = contextContainer_->at<jni::alias_ref<
        jni::detail::JTypeFor<JFabricUIManager, jni::JObject, void>::_javaobject
            *>>("FabricUIManager");
    auto uiManager =
        fabricUIManager->getBinding()->getScheduler()->getUIManager();
    uiManager->unregisterCommitHook(*this);
  }
}

RootShadowNode::Unshared RNSScreenShadowNodeCommitHook::shadowTreeWillCommit(
    const facebook::react::ShadowTree &shadowTree,
    const RootShadowNode::Shared &oldRootShadowNode,
    const RootShadowNode::Unshared &newRootShadowNode,
    const ShadowTreeCommitOptions &) noexcept {
  auto oldRootProps =
      std::static_pointer_cast<const RootProps>(oldRootShadowNode->getProps());
  auto newRootProps =
      std::static_pointer_cast<const RootProps>(newRootShadowNode->getProps());

  const bool wasHorizontal = isHorizontal_(oldRootProps);
  const bool willBeHorizontal = isHorizontal_(newRootProps);

  if ((wasHorizontal && !willBeHorizontal) ||
      (!wasHorizontal && willBeHorizontal)) {
    screenComponentDescriptor_->setOrientationDidChange();
  }

  return std::static_pointer_cast<RootShadowNode>(
      newRootShadowNode->ShadowNode::clone(ShadowNodeFragment{}));
}

} // namespace react
} // namespace facebook
