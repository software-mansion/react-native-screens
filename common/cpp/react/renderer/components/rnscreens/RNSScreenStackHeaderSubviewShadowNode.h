#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "FrameCorrectionModes.h"
#include "RNSScreenStackHeaderSubviewState.h"

namespace facebook::react {

using namespace rnscreens;

JSI_EXPORT extern const char RNSScreenStackHeaderSubviewComponentName[];

class JSI_EXPORT RNSScreenStackHeaderSubviewShadowNode final
    : public ConcreteViewShadowNode<
          RNSScreenStackHeaderSubviewComponentName,
          RNSScreenStackHeaderSubviewProps,
          RNSScreenStackHeaderSubviewEventEmitter,
          RNSScreenStackHeaderSubviewState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;
#pragma mark - ShadowNode overrides
  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface
  void applyFrameCorrections();
};

} // namespace facebook::react
