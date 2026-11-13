#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSSplitScreenState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSSplitScreenComponentName[];

using ConcreteViewShadowNodeSuperType = ConcreteViewShadowNode<
    RNSSplitScreenComponentName,
    RNSSplitScreenProps,
    RNSSplitScreenEventEmitter,
    RNSSplitScreenState>;

class JSI_EXPORT RNSSplitScreenShadowNode final
    : public ConcreteViewShadowNodeSuperType {
 public:
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  RNSSplitScreenShadowNode(
      const ShadowNodeFragment &fragment,
      const ShadowNodeFamily::Shared &family,
      ShadowNodeTraits traits);

  RNSSplitScreenShadowNode(
      const ShadowNode &sourceShadowNode,
      const ShadowNodeFragment &fragment);

#pragma mark - ShadowNode overrides

  void appendChild(const std::shared_ptr<const ShadowNode> &child) override;

  Point getContentOriginOffset(bool includeTransform) const override;
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }

 private:
  void updateDisplayForContent();
};

} // namespace facebook::react
