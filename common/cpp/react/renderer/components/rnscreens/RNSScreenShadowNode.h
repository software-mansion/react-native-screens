#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutConstraints.h>
#include <react/renderer/core/LayoutContext.h>
#include "FrameCorrectionModes.h"
#include "RNSScreenState.h"

namespace facebook {
namespace react {

using namespace rnscreens;

JSI_EXPORT extern const char RNSScreenComponentName[];

class JSI_EXPORT RNSScreenShadowNode final : public ConcreteViewShadowNode<
                                                 RNSScreenComponentName,
                                                 RNSScreenProps,
                                                 RNSScreenEventEmitter,
                                                 RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;

  void appendChild(const std::shared_ptr<const ShadowNode> &child) override;

  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface

  void setHeaderHeight(float headerHeight);

  FrameCorrectionModes &getFrameCorrectionModes();

#ifdef ANDROID
  void resetFrameSizeState();

  void applyFrameCorrections();

  void layoutTree(
      facebook::react::LayoutContext layoutContext,
      facebook::react::LayoutConstraints layoutConstraints) override {
    YogaLayoutableShadowNode::layoutTree(layoutContext, layoutConstraints);
  }

 private:
  StateData &getStateDataMutable();
#endif // ANDROID
};

} // namespace react
} // namespace facebook
