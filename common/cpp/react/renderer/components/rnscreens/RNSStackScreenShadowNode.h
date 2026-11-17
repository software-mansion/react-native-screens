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
   * Whether the frame the native side sends via shadow state should be applied
   * to this node (setSize + contentOffset). On Android this is currently
   * required. On iOS this is enabled in JS only in case a Stack is nested
   * inside a Split - as it is `StackScreen` role then to convey platform column
   * dimensions to the React screen contents.
   */
  bool shouldApplyReportedFrame() const;

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react
