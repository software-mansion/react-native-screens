#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHostComponentName[];

class JSI_EXPORT RNSStackHostShadowNode final : public ConcreteViewShadowNode<
                                                    RNSStackHostComponentName,
                                                    RNSStackHostProps,
                                                    RNSStackHostEventEmitter> {
 public:
  RNSStackHostShadowNode(
      const ShadowNodeFragment &fragment,
      const ShadowNodeFamily::Shared &family,
      ShadowNodeTraits traits);

  RNSStackHostShadowNode(
      const ShadowNode &sourceShadowNode,
      const ShadowNodeFragment &fragment);

#if !defined(ANDROID)
 private:
  void updateDisplayForExternalNavigationController();
#endif // !defined(ANDROID)
};

} // namespace facebook::react
