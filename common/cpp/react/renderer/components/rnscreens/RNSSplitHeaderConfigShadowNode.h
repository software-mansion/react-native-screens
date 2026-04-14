#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSSplitHeaderConfigState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSSplitHeaderConfigComponentName[];

class JSI_EXPORT RNSSplitHeaderConfigShadowNode final
    : public ConcreteViewShadowNode<
          RNSSplitHeaderConfigComponentName,
          RNSSplitHeaderConfigProps,
          RNSSplitHeaderConfigEventEmitter,
          RNSSplitHeaderConfigState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  void layout(LayoutContext layoutContext) override;

 private:
  void applyFrameCorrections();
};

} // namespace facebook::react
