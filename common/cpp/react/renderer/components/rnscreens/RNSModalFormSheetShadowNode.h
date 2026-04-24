#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSModalFormSheetState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSModalFormSheetComponentName[];

class JSI_EXPORT RNSModalFormSheetShadowNode final
    : public ConcreteViewShadowNode<
          RNSModalFormSheetComponentName,
          RNSModalFormSheetProps,
          RNSModalFormSheetEventEmitter,
          RNSModalFormSheetState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react
