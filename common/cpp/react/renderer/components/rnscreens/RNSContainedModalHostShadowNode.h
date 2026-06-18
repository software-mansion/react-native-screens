#pragma once

#if !defined(ANDROID)

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSContainedModalHostState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSContainedModalHostComponentName[];

class JSI_EXPORT RNSContainedModalHostShadowNode final
    : public ConcreteViewShadowNode<
          RNSContainedModalHostComponentName,
          RNSContainedModalHostProps,
          RNSContainedModalHostEventEmitter,
          RNSContainedModalHostState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react

#endif // !defined(ANDROID)
