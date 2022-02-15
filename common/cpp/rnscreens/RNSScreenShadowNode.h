#pragma once

#include "RNSScreenState.h"
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[];

class RNSScreenShadowNode final : public ConcreteViewShadowNode<
                                          RNSScreenComponentName,
                                          RNSScreenProps,
                                          RNSScreenEventEmitter,
                                          RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace react
} // namespace facebook
