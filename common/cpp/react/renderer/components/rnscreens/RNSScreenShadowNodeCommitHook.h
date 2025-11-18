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
  RNSScreenShadowNodeCommitHook(std::shared_ptr<const ContextContainer>);

  RNSScreenShadowNodeCommitHook(const RNSScreenShadowNodeCommitHook &);

  virtual ~RNSScreenShadowNodeCommitHook() noexcept override;

  virtual void commitHookWasRegistered(const UIManager &) noexcept override {}

  virtual void commitHookWasUnregistered(const UIManager &) noexcept override {}

  virtual RootShadowNode::Unshared shadowTreeWillCommit(
      const ShadowTree &shadowTree,
      const RootShadowNode::Shared &oldRootShadowNode,
      const RootShadowNode::Unshared &newRootShadowNode,
      const ShadowTreeCommitOptions & /*commitOptions*/) noexcept override;

 private:
  std::shared_ptr<const ContextContainer> contextContainer_;

  void findScreenNodes(
      const std::shared_ptr<const ShadowNode> &rootShadowNode,
      std::vector<std::shared_ptr<const RNSScreenShadowNode>> &screenNodes);

  inline bool isHorizontal_(std::weak_ptr<const RootProps> props) {
    auto layoutConstraints = props.lock().get()->layoutConstraints;
    const float width = layoutConstraints.maximumSize.width;
    const float height = layoutConstraints.maximumSize.height;

    return width > height;
  };
};

} // namespace react
} // namespace facebook
