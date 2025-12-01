#ifdef ANDROID

#include "RNSScreenShadowNodeCommitHook.h"
#include <stack>

namespace facebook {
namespace react {

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    std::shared_ptr<const ContextContainer> contextContainer)
    : contextContainer_(contextContainer) {
  getUIManagerFromSharedContext(contextContainer)->registerCommitHook(*this);
}

RNSScreenShadowNodeCommitHook::~RNSScreenShadowNodeCommitHook() noexcept {
  const auto contextContainer = contextContainer_.lock();
  if (contextContainer) {
    getUIManagerFromSharedContext(contextContainer)
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

  if (wasHorizontal != willBeHorizontal) {
    return newRootShadowNodeWithScreenFrameSizesReset(newRootShadowNode);
  }

  return newRootShadowNode;
}

RootShadowNode::Unshared
RNSScreenShadowNodeCommitHook::newRootShadowNodeWithScreenFrameSizesReset(
    RootShadowNode::Unshared rootShadowNode) {
  std::vector<const RNSScreenShadowNode *> screens;
  findScreenNodes(rootShadowNode, screens);

  for (auto screen : screens) {
    const auto rootShadowNodeClone = rootShadowNode->cloneTree(
        screen->getFamily(), [](const ShadowNode &oldShadowNode) {
          auto clone = oldShadowNode.clone({.state = oldShadowNode.getState()});
          auto screenNode = static_pointer_cast<RNSScreenShadowNode>(clone);
          auto yogaNode = static_pointer_cast<YogaLayoutableShadowNode>(clone);

          screenNode->resetFrameSizeState();
          yogaNode->setSize({YGUndefined, YGUndefined});

          return clone;
        });

    if (rootShadowNodeClone) {
      rootShadowNode =
          std::static_pointer_cast<RootShadowNode>(rootShadowNodeClone);
    }
  }

  return rootShadowNode;
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

std::shared_ptr<UIManager>
RNSScreenShadowNodeCommitHook::getUIManagerFromSharedContext(
    std::shared_ptr<const ContextContainer> sharedContext) {
  auto fabricUIManager =
      sharedContext
          ->at<jni::alias_ref<facebook::react::JFabricUIManager::javaobject>>(
              "FabricUIManager");
  return fabricUIManager->getBinding()->getScheduler()->getUIManager();
}

} // namespace react
} // namespace facebook

#endif // ANDROID
