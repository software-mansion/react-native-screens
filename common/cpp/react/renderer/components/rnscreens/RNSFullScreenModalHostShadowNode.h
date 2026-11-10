#pragma once

#if !defined(ANDROID)

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSFullScreenModalHostState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFullScreenModalHostComponentName[];

class JSI_EXPORT RNSFullScreenModalHostShadowNode final
    : public ConcreteViewShadowNode<
          RNSFullScreenModalHostComponentName,
          RNSFullScreenModalHostProps,
          RNSFullScreenModalHostEventEmitter,
          RNSFullScreenModalHostState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react

#endif // !defined(ANDROID)
