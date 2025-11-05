#include "RNSScreenShadowNodeCommitHook.h"
#include <android/log.h>
#include <react/fabric/FabricUIManagerBinding.h>
#include <react/fabric/JFabricUIManager.h>
#include <react/renderer/scheduler/Scheduler.h>
#include <cstdio>
#include <iostream>
#include <sstream>
#include <stack>
#include <thread>

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

RNSScreenShadowNodeCommitHook::RNSScreenShadowNodeCommitHook(
    const RNSScreenShadowNodeCommitHook &other) {
  contextContainer_ = other.contextContainer_;
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

  const bool wasHorizontal = isHorizontal_(oldRootProps);
  const bool willBeHorizontal = isHorizontal_(newRootProps);

  const bool orientationDidChange = (wasHorizontal && !willBeHorizontal) ||
      (!wasHorizontal && willBeHorizontal);

  // Convert threadId to string using stringstream
  auto hash = std::hash<std::thread::id>{}(std::this_thread::get_id());

  auto newRootSize =
      newRootShadowNode->getConcreteProps().layoutConstraints.maximumSize;
  std::vector<std::shared_ptr<const RNSScreenShadowNode>> screens;
  __android_log_print(
      ANDROID_LOG_DEBUG,
      "SCREENS",
      "Thread: %zu DFS start tree rev=%ld RSN w=%f h=%f",
      hash,
      (long)shadowTree.getCurrentRevision().number,
      newRootSize.width,
      newRootSize.height);
  findScreenNodes(newRootShadowNode, screens);

  std::shared_ptr<ShadowNode> finalRootShadowNode = newRootShadowNode;
  if (orientationDidChange ||
      shadowTree.getCurrentRevision().number <= this->lastRotatedRevision_) {
    //    this->lastRotatedRevision_ = shadowTree.getCurrentRevision().number +
    //    1;

    for (auto screen : screens) {
      const auto rootShadowNodeClone = newRootShadowNode->cloneTree(
          screen->getFamily(), [](const ShadowNode &oldShadowNode) {
            const auto &screenShadowNode =
                dynamic_cast<const RNSScreenShadowNode &>(oldShadowNode);
            const auto &oldStateData = dynamic_cast<const RNSScreenState &>(
                screenShadowNode.getStateData());
            auto newData = RNSScreenState(
                {.width = 0.f, .height = 0.f}, oldStateData.contentOffset);
            std::shared_ptr<const void> newDataPtr =
                std::make_shared<const RNSScreenState>(newData);
            auto newState = oldShadowNode.getComponentDescriptor().createState(
                oldShadowNode.getFamily(), newDataPtr);
            auto clone = oldShadowNode.clone({.state = newState});

            //            auto clone =
            //                oldShadowNode.clone({.state =
            //                oldShadowNode.getState()});
            __android_log_print(
                ANDROID_LOG_DEBUG,
                "SCREENS",
                "[[Hook]] ^^^ cloned screen old rev=%d new rev=%d",
                oldShadowNode.revision_,
                clone->revision_);
            auto screenNode = static_pointer_cast<RNSScreenShadowNode>(clone);
            auto yogaNode =
                static_pointer_cast<YogaLayoutableShadowNode>(clone);

            //            screenNode->getStateDataMutable().frameSize = {0, 0};
            // This should be now cleaned up in adopt, after I've added that
            // "else if", however lets just make sure.
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
    const std::shared_ptr<const ShadowNode> &rootShadowNode,
    std::vector<std::shared_ptr<const RNSScreenShadowNode>> &screenNodes) {
  std::stack<std::shared_ptr<const ShadowNode>> shadowNodesToVisit;
  shadowNodesToVisit.emplace(rootShadowNode);

  while (!shadowNodesToVisit.empty()) {
    auto node = shadowNodesToVisit.top();
    shadowNodesToVisit.pop();

    for (auto child : node->getChildren()) {
      if (std::strcmp(node->getComponentName(), "RNSScreen") == 0) {
        screenNodes.push_back(
            std::dynamic_pointer_cast<const RNSScreenShadowNode>(node));
        auto frame =
            ((RNSScreenShadowNode *)node.get())->getLayoutMetrics().frame;
        auto frameSize =
            ((RNSScreenShadowNode *)node.get())->getStateData().frameSize;
        __android_log_print(
            ANDROID_LOG_DEBUG,
            "SCREENS",
            "[[Hook]] Screen rev=%d frameSize w=%f h=%f frame w=%f h=%f",
            node->revision_,
            frameSize.width,
            frameSize.height,
            frame.size.width,
            frame.size.height);
      }
      shadowNodesToVisit.emplace(child);
    }
  }
}

} // namespace react
} // namespace facebook
