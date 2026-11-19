#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSSheetHostState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSSheetHostComponentName[];

class JSI_EXPORT RNSSheetHostShadowNode final : public ConcreteViewShadowNode<
                                                    RNSSheetHostComponentName,
                                                    RNSSheetHostProps,
                                                    RNSSheetHostEventEmitter,
                                                    RNSSheetHostState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react
