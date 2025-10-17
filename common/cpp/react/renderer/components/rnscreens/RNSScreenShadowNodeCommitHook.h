#pragma once

#include <react/renderer/uimanager/UIManagerCommitHook.h>

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor;

class RNSScreenShadowNodeCommitHook : public UIManagerCommitHook {
 public:
  RNSScreenShadowNodeCommitHook(
      std::shared_ptr<const ContextContainer>,
      RNSScreenComponentDescriptor *);

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
  RNSScreenComponentDescriptor *screenComponentDescriptor_;

  inline bool isHorizontal_(std::weak_ptr<const RootProps> props) {
    const float width = props.lock().get()->layoutConstraints.maximumSize.width;
    const float height =
        props.lock().get()->layoutConstraints.maximumSize.height;

    return width > height;
  };
};

} // namespace react
} // namespace facebook
