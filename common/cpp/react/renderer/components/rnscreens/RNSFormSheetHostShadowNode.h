#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSFormSheetHostState.h"
#include "utils/LayoutFromState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSFormSheetHostComponentName[];

class JSI_EXPORT RNSFormSheetHostShadowNode final
    : public rnscreens::SizeFromStateShadowNode<ConcreteViewShadowNode<
          RNSFormSheetHostComponentName,
          RNSFormSheetHostProps,
          RNSFormSheetHostEventEmitter,
          RNSFormSheetHostState>> {
 public:
  using SizeFromStateShadowNode::SizeFromStateShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react
