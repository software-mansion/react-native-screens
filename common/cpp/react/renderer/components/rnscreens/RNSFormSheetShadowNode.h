#pragma once

#ifndef ANDROID

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSFormSheetState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFormSheetComponentName[];

class JSI_EXPORT RNSFormSheetShadowNode final : public ConcreteViewShadowNode<
                                                    RNSFormSheetComponentName,
                                                    RNSFormSheetProps,
                                                    RNSFormSheetEventEmitter,
                                                    RNSFormSheetState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  Point getContentOriginOffset(bool includeTransform) const override;
};

} // namespace facebook::react

#endif // ANDROID
