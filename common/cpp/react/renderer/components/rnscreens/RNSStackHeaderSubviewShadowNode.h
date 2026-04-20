#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSStackHeaderSubviewState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderSubviewComponentName[];

class JSI_EXPORT RNSStackHeaderSubviewShadowNode final
    : public ConcreteViewShadowNode<
          RNSStackHeaderSubviewComponentName,
          RNSStackHeaderSubviewAndroidProps,
          RNSStackHeaderSubviewAndroidEventEmitter,
          RNSStackHeaderSubviewState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#ifdef ANDROID
#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;

  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface
 private:
  void applyFrameCorrections();
#endif // ANDROID
};

} // namespace facebook::react
