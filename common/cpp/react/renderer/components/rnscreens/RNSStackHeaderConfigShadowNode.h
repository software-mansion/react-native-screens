#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSStackHeaderConfigState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderConfigComponentName[];

class JSI_EXPORT RNSStackHeaderConfigShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderConfigComponentName,
          RNSStackHeaderConfigProps,
          RNSStackHeaderConfigEventEmitter,
          RNSStackHeaderConfigState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  void layout(LayoutContext layoutContext) override;

 private:
  void applyFrameCorrections();
};

} // namespace facebook::react
