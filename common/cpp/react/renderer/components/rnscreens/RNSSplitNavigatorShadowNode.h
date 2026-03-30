#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSSplitNavigatorState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSSplitNavigatorComponentName[];

using ConcreteViewShadowNodeSuperType = ConcreteViewShadowNode<
    RNSSplitNavigatorComponentName,
    RNSSplitNavigatorProps,
    RNSSplitNavigatorEventEmitter,
    RNSSplitNavigatorState>;

class JSI_EXPORT RNSSplitNavigatorShadowNode final
    : public ConcreteViewShadowNodeSuperType {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react
