#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSSplitScreenState.h"
#include "utils/LayoutFromState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSSplitScreenComponentName[];

using ConcreteViewShadowNodeSuperType = ConcreteViewShadowNode<
    RNSSplitScreenComponentName,
    RNSSplitScreenProps,
    RNSSplitScreenEventEmitter,
    RNSSplitScreenState>;

class JSI_EXPORT RNSSplitScreenShadowNode final
    : public rnscreens::SizeFromStateShadowNode<
          ConcreteViewShadowNodeSuperType> {
 public:
  using SizeFromStateShadowNode::SizeFromStateShadowNode;
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
