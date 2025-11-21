#ifdef ANDROID

#include "RNSScreenShadowNodeCommitHook.h"
#include <stack>

namespace facebook {
namespace react {

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    std::shared_ptr<const ContextContainer> contextContainer)
    : contextContainer_(contextContainer) {
  if (contextContainer_) {
    auto fabricUIManager =
        contextContainer_
            ->at<jni::alias_ref<facebook::react::JFabricUIManager::javaobject>>(
                "FabricUIManager");
    fabricUIManager->getBinding()
        ->getScheduler()
        ->getUIManager()
        ->registerCommitHook(*this);
  }
}

RNSScreenShadowNodeCommitHook::~RNSScreenShadowNodeCommitHook() noexcept {
  if (contextContainer_) {
    auto fabricUIManager =
        contextContainer_
            ->at<jni::alias_ref<facebook::react::JFabricUIManager::javaobject>>(
                "FabricUIManager");
    fabricUIManager->getBinding()
        ->getScheduler()
        ->getUIManager()
        ->unregisterCommitHook(*this);
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

  const bool wasHorizontal = isHorizontal_(*oldRootProps.get());
  const bool willBeHorizontal = isHorizontal_(*newRootProps.get());

  const bool orientationDidChange = wasHorizontal != willBeHorizontal;

  std::shared_ptr<ShadowNode> finalRootShadowNode = newRootShadowNode;
  if (orientationDidChange) {
    std::vector<const RNSScreenShadowNode *> screens;
    findScreenNodes(newRootShadowNode, screens);

    for (auto screen : screens) {
      const auto rootShadowNodeClone = newRootShadowNode->cloneTree(
          screen->getFamily(), [](const ShadowNode &oldShadowNode) {
            auto clone =
                oldShadowNode.clone({.state = oldShadowNode.getState()});
            auto screenNode = static_pointer_cast<RNSScreenShadowNode>(clone);
            auto yogaNode =
                static_pointer_cast<YogaLayoutableShadowNode>(clone);

            screenNode->resetFrameSizeState();
            yogaNode->setSize({YGUndefined, YGUndefined});

            return clone;
          });

      if (rootShadowNodeClone) {
        finalRootShadowNode = rootShadowNodeClone;
      }
    }
  }

  return std::static_pointer_cast<RootShadowNode>(finalRootShadowNode);
}

void RNSScreenShadowNodeCommitHook::findScreenNodes(
    const std::shared_ptr<const ShadowNode> &rootShadowNode,
    std::vector<const RNSScreenShadowNode *> &screenNodes) {
  std::stack<const ShadowNode *> shadowNodesToVisit;
  shadowNodesToVisit.emplace(rootShadowNode.get());

  while (!shadowNodesToVisit.empty()) {
    auto node = shadowNodesToVisit.top();
    shadowNodesToVisit.pop();

    for (auto const &child : node->getChildren()) {
      if (node->getComponentHandle() == RNSScreenShadowNode::Handle()) {
        screenNodes.push_back(static_cast<const RNSScreenShadowNode *>(node));
      }
      shadowNodesToVisit.emplace(child.get());
    }
  }
}

} // namespace react
} // namespace facebook

#endif // ANDROID
