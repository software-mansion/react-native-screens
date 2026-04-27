#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSInlineModalState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSInlineModalComponentName[];

class JSI_EXPORT RNSInlineModalShadowNode final
    : public ConcreteViewShadowNode<
          RNSInlineModalComponentName,
          RNSInlineModalProps,
          RNSInlineModalEventEmitter,
          RNSInlineModalState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
