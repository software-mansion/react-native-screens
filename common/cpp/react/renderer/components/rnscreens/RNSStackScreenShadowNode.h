#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSStackScreenState.h"
#include "utils/LayoutFromState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackScreenComponentName[];

class JSI_EXPORT RNSStackScreenShadowNode final
    : public rnscreens::SizeFromStateShadowNode<ConcreteViewShadowNode<
          RNSStackScreenComponentName,
          RNSStackScreenProps,
          RNSStackScreenEventEmitter,
          RNSStackScreenState>> {
 public:
  using SizeFromStateShadowNode::SizeFromStateShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - ShadowNode overrides

#ifdef ANDROID
  Point getContentOriginOffset(bool includeTransform) const override;
#endif // ANDROID
};

} // namespace facebook::react
