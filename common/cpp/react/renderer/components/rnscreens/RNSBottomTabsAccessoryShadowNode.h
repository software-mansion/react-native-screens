#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSBottomTabsAccessoryState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSBottomTabsAccessoryComponentName[];

class JSI_EXPORT RNSBottomTabsAccessoryShadowNode final
    : public ConcreteViewShadowNode<
          RNSBottomTabsAccessoryComponentName,
          RNSBottomTabsAccessoryProps,
          RNSBottomTabsAccessoryEventEmitter,
          RNSBottomTabsAccessoryState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react
