#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSStackHeaderSubviewState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderSubviewComponentName[];

class JSI_EXPORT RNSStackHeaderSubviewShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderSubviewComponentName,
          RNSStackHeaderSubviewProps,
          RNSStackHeaderSubviewEventEmitter,
          RNSStackHeaderSubviewState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#ifdef ANDROID
  Point getContentOriginOffset(bool includeTransform) const override;
#endif // ANDROID
};

} // namespace facebook::react
