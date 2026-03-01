#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSTabsBottomAccessoryState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSTabsBottomAccessoryComponentName[];

class JSI_EXPORT RNSTabsBottomAccessoryShadowNode final
    : public ConcreteViewShadowNode<
          RNSTabsBottomAccessoryComponentName,
          RNSTabsBottomAccessoryProps,
          RNSTabsBottomAccessoryEventEmitter,
          RNSTabsBottomAccessoryState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react
