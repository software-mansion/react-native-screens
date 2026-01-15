#pragma once

#include <react/fabric/FabricUIManagerBinding.h>
#include <react/fabric/JFabricUIManager.h>
#include <react/renderer/scheduler/Scheduler.h>
#include <react/renderer/uimanager/UIManagerCommitHook.h>
#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor;

class RNSScreenShadowNodeCommitHook : public UIManagerCommitHook {
 public:
  RNSScreenShadowNodeCommitHook(
      const std::shared_ptr<const ContextContainer> &);

  virtual ~RNSScreenShadowNodeCommitHook() noexcept override;

  virtual void commitHookWasRegistered(const UIManager &) noexcept override {}

  virtual void commitHookWasUnregistered(const UIManager &) noexcept override {}

  virtual RootShadowNode::Unshared shadowTreeWillCommit(
      const ShadowTree &shadowTree,
      const RootShadowNode::Shared &oldRootShadowNode,
      const RootShadowNode::Unshared &newRootShadowNode,
      const ShadowTreeCommitOptions & /*commitOptions*/) noexcept override;

 private:
  static inline bool isHorizontal_(const RootProps &props) {
    const auto &layoutConstraints = props.layoutConstraints;
    const float width = layoutConstraints.maximumSize.width;
    const float height = layoutConstraints.maximumSize.height;

    return width > height;
  };

  static RootShadowNode::Unshared newRootShadowNodeWithScreenFrameSizesReset(
      RootShadowNode::Unshared rootShadowNode);

  static void findScreenNodes(
      const std::shared_ptr<const ShadowNode> &rootShadowNode,
      std::vector<const RNSScreenShadowNode *> &screenNodes);

  static std::shared_ptr<UIManager> getUIManagerFromSharedContext(
      const std::shared_ptr<const ContextContainer> &sharedContext);
};

} // namespace react
} // namespace facebook
