#ifdef ANDROID

#include "RNSScreenShadowNodeCommitHook.h"
#include <stack>

namespace facebook {
namespace react {

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    const std::shared_ptr<const ContextContainer> &contextContainer) {
  if (auto uiManager = getUIManagerFromSharedContext(contextContainer)) {
    uiManager->registerCommitHook(*this);
  }
}

RNSScreenShadowNodeCommitHook::~RNSScreenShadowNodeCommitHook() noexcept {
  // We intentionally don't unregister the commit hook here.
  // During hot reload, the FabricUIManagerBinding may already be destroyed
  // when this destructor is called, causing a JNI crash when trying to
  // access the binding. The UIManager will clean up hooks when it's destroyed
  // In case the lifecycle of the commit hook should be shorter than
  // that of the UIManager consider unregistering the hook manually.
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

  // Check if screen area has changed size (either because of orientation
  // change, or application resize with floating window / split screen)
  if (_screenSizeChanged(*oldRootProps, *newRootProps)) {
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

/**
 * This method might return nullptr. See its implementation for details.
 */
std::shared_ptr<UIManager>
RNSScreenShadowNodeCommitHook::getUIManagerFromSharedContext(
    const std::shared_ptr<const ContextContainer> &sharedContext) {
  if (sharedContext == nullptr) {
    return nullptr;
  }

  auto fabricUIManager =
      sharedContext
          ->at<jni::alias_ref<facebook::react::JFabricUIManager::javaobject>>(
              "FabricUIManager");
  if (fabricUIManager == nullptr) {
    return nullptr;
  }

  // This line might still crash in case the FabricUIManager.mBinding (Java
  // class) is at this moment `null`.
  auto *fabricUiManagerBinding = fabricUIManager->getBinding();
  if (fabricUiManagerBinding == nullptr) {
    return nullptr;
  }

  auto scheduler = fabricUiManagerBinding->getScheduler();
  if (scheduler == nullptr) {
    return nullptr;
  }

  return scheduler->getUIManager();
}

} // namespace react
} // namespace facebook

#endif // ANDROID
