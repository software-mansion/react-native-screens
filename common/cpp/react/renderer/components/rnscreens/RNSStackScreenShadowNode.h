#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSStackScreenState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackScreenComponentName[];

class JSI_EXPORT RNSStackScreenShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackScreenComponentName,
          RNSStackScreenProps,
          RNSStackScreenEventEmitter,
          RNSStackScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  /**
   * Whether the frame the screen view reported through the state applies to
   * this node, as its size and its content offset. On Android always. On iOS
   * only with `reportsFrameToShadowTree`, that is when the screen is placed by
   * a native container that Yoga does not lay out; otherwise Yoga sizes the
   * screen through its parent and the state is ignored.
   */
  bool shouldApplyReportedFrame() const;

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react
