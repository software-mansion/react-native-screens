#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSFormSheetHostState.h"
#include "utils/YogaSizeUtil.h"

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

  // Like `setSize`, but leaves the Yoga node clean when the size is unchanged.
  // See `rnscreens::yogaStyleHasSize`.
  void setSizeIfChanged(Size size) const {
    if (!rnscreens::yogaStyleHasSize(yogaNode_.style(), size)) {
      setSize(size);
    }
  }

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react
