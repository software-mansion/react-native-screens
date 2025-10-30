#include "RNSScreenShadowNodeCommitHook.h"
#include <android/log.h>
#include <react/fabric/FabricUIManagerBinding.h>
#include <react/fabric/JFabricUIManager.h>
#include <react/renderer/scheduler/Scheduler.h>

namespace facebook {
namespace react {

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    std::shared_ptr<const ContextContainer> contextContainer)
    : contextContainer_(contextContainer) {
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
  const bool orientationDidChange = (wasHorizontal && !willBeHorizontal) ||
      (!wasHorizontal && willBeHorizontal);

  std::shared_ptr<ShadowNode> finalRootShadowNode = newRootShadowNode;
  if (orientationDidChange) {
    std::vector<RNSScreenShadowNode *> screens;
    findScreenNodes(newRootShadowNode.get(), &screens);

    for (auto screen : screens) {
      const auto rootShadowNodeClone = newRootShadowNode->cloneTree(
          screen->getFamily(), [](const ShadowNode &oldShadowNode) {
            auto clone =
                oldShadowNode.clone({.state = oldShadowNode.getState()});
            auto screenNode = static_pointer_cast<RNSScreenShadowNode>(clone);
            auto yogaNode =
                static_pointer_cast<YogaLayoutableShadowNode>(clone);

            screenNode->getStateDataMutable().frameSize = {0, 0};
            screenNode->getStateDataMutable().contentOffset = {0, 0};
            yogaNode->setSize({YGUndefined, YGUndefined});

            return clone;
          });

      if (rootShadowNodeClone) {
        finalRootShadowNode = rootShadowNodeClone;
      }
    }
  }

  return std::static_pointer_cast<RootShadowNode>(
      finalRootShadowNode->ShadowNode::clone(ShadowNodeFragment{}));
}

void RNSScreenShadowNodeCommitHook::findScreenNodes(
    const ShadowNode *node,
    std::vector<RNSScreenShadowNode *> *screenNodes) {
  // TODO: think of sth better than full DFS over shadow tree; maybe, for
  // instance, a screen registry?
  for (auto child : node->getChildren()) {
    if (std::strcmp(node->getComponentName(), "RNSScreen") == 0) {
      screenNodes->push_back((RNSScreenShadowNode *)node);
    }
    findScreenNodes(child.get(), screenNodes);
  }
}

} // namespace react
} // namespace facebook
