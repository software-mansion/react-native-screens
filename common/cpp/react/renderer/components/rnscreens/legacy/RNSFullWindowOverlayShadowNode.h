#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSFullWindowOverlayState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFullWindowOverlayComponentName[];

using ConcreteViewShadowNodeSuperType = ConcreteViewShadowNode<
    RNSFullWindowOverlayComponentName,
    RNSFullWindowOverlayProps,
    RNSFullWindowOverlayEventEmitter,
    RNSFullWindowOverlayState>;

class JSI_EXPORT RNSFullWindowOverlayShadowNode final
    : public ConcreteViewShadowNodeSuperType {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#if !defined(ANDROID)
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNodeSuperType::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
#endif
};

} // namespace facebook::react
