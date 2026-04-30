#pragma once

#if !defined(ANDROID)

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSFormSheetHostState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFormSheetHostComponentName[];

class JSI_EXPORT RNSFormSheetHostShadowNode final
    : public ConcreteViewShadowNode<
          RNSFormSheetHostComponentName,
          RNSFormSheetHostProps,
          RNSFormSheetHostEventEmitter,
          RNSFormSheetHostState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react

#endif // !defined(ANDROID)
