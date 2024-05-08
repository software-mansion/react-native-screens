#pragma once

#include "RNSScreenState.h"
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSScreenComponentName[];

class JSI_EXPORT RNSScreenShadowNode final : public ConcreteViewShadowNode<
                                          RNSScreenComponentName,
                                          RNSScreenProps,
                                          RNSScreenEventEmitter,
                                          RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset() const override;
};

} // namespace react
} // namespace facebook
