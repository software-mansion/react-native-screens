#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSStackHeaderConfigurationState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderConfigurationComponentName[];

class JSI_EXPORT RNSStackHeaderConfigurationShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderConfigurationComponentName,
          RNSStackHeaderConfigurationProps,
          RNSStackHeaderConfigurationEventEmitter,
          RNSStackHeaderConfigurationState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;
};

} // namespace facebook::react
