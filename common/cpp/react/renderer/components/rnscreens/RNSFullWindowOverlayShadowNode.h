#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSFullWindowOverlayState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFullWindowOverlayComponentName[];

class JSI_EXPORT RNSFullWindowOverlayShadowNode final
    : public ConcreteViewShadowNode<
          RNSFullWindowOverlayComponentName,
          RNSFullWindowOverlayProps,
          RNSFullWindowOverlayEventEmitter,
          RNSFullWindowOverlayState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#if !defined(ANDROID)
  void layout(LayoutContext layoutContext) override;

  void applyFrameCorrections();
#endif
};

} // namespace facebook::react
