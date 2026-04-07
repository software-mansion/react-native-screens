#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSStackHeaderConfigState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderConfigComponentName[];

class JSI_EXPORT RNSStackHeaderConfigShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderConfigComponentName,
#if !defined(ANDROID)
          RNSStackHeaderConfigIOSProps,
          RNSStackHeaderConfigIOSEventEmitter,
#else // !defined(ANDROID)
          RNSStackHeaderConfigAndroidProps,
          RNSStackHeaderConfigAndroidEventEmitter,
#endif // !defined(ANDROID)
          RNSStackHeaderConfigState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#ifdef ANDROID
  Point getContentOriginOffset(bool includeTransform) const override;
#endif // ANDROID
};

} // namespace facebook::react
