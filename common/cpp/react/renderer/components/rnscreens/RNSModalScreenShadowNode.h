#pragma once

#include "RNSScreenState.h"
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSModalScreenComponentName[];

class JSI_EXPORT RNSModalScreenShadowNode final : public ConcreteViewShadowNode<
                                          RNSModalScreenComponentName,
                                          RNSScreenProps,
                                          RNSScreenEventEmitter,
                                          RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset() const override;
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace react
} // namespace facebook
