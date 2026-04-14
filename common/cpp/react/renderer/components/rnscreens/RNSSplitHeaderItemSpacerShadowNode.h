#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

JSI_EXPORT extern const char RNSSplitHeaderItemSpacerComponentName[];

class JSI_EXPORT RNSSplitHeaderItemSpacerShadowNode final
    : public ConcreteViewShadowNode<
          RNSSplitHeaderItemSpacerComponentName,
          RNSSplitHeaderItemSpacerIOSProps,
          RNSSplitHeaderItemSpacerIOSEventEmitter> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
