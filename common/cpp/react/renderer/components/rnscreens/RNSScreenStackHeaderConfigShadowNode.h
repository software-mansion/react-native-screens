#pragma once

#include <jsi/jsi.h>
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSScreenStackHeaderConfigState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSScreenStackHeaderConfigComponentName[];

class JSI_EXPORT RNSScreenStackHeaderConfigShadowNode final
    : public ConcreteViewShadowNode<
          RNSScreenStackHeaderConfigComponentName,
          RNSScreenStackHeaderConfigProps,
          RNSScreenStackHeaderConfigEventEmitter,
          RNSScreenStackHeaderConfigState> {
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
