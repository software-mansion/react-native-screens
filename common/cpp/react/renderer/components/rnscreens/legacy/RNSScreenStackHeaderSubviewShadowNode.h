#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "../FrameCorrectionModes.h"
#include "RNSScreenStackHeaderSubviewState.h"

namespace facebook::react {

using namespace rnscreens;

JSI_EXPORT extern const char RNSScreenStackHeaderSubviewComponentName[];

class JSI_EXPORT RNSScreenStackHeaderSubviewShadowNode final
    : public ConcreteViewShadowNode<
          RNSScreenStackHeaderSubviewComponentName,
          RNSScreenStackHeaderSubviewProps,
          RNSScreenStackHeaderSubviewEventEmitter,
          RNSScreenStackHeaderSubviewState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;
#pragma mark - ShadowNode overrides
  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface
  /**
   * The frame origin `layout()` sets, given the one computed by Yoga: native
   * positions the subview in the navigation bar / toolbar and reports where.
   * The component descriptor compares it with the current layout metrics.
   */
  Point correctFrameOrigin(Point origin) const;

  void applyFrameCorrections();
};

} // namespace facebook::react
