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

#pragma mark - ShadowNode overrides

#ifdef ANDROID
  Point getContentOriginOffset(bool includeTransform) const override;
#endif // ANDROID
};

} // namespace facebook::react
