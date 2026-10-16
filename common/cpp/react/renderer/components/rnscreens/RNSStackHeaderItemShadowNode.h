#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSStackHeaderItemState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderItemComponentName[];

class JSI_EXPORT RNSStackHeaderItemShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderItemComponentName,
          RNSStackHeaderItemIOSProps,
          RNSStackHeaderItemIOSEventEmitter,
          RNSStackHeaderItemState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  void layout(LayoutContext layoutContext) override;

  /**
   * The frame origin `layout()` sets, given the one computed by Yoga: native
   * positions the item in the navigation bar and reports where. The component
   * descriptor compares it with the current layout metrics.
   */
  Point correctFrameOrigin(Point origin) const;

 private:
  void applyFrameCorrections();
};

} // namespace facebook::react
