#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSTabsScreenState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSTabsScreenComponentName[];

class JSI_EXPORT RNSTabsScreenShadowNode final
    : public ConcreteViewShadowNode<
          RNSTabsScreenComponentName,
          RNSTabsScreenIOSProps,
          RNSTabsScreenIOSEventEmitter,
          RNSTabsScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset(bool /* includeTransform */) const override {
    return getStateData().contentOffset;
  }
};

} // namespace facebook::react
