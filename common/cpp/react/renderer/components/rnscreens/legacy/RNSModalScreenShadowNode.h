#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "../utils/YogaSizeUtil.h"
#include "RNSScreenState.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSModalScreenComponentName[];

class JSI_EXPORT RNSModalScreenShadowNode final
    : public ConcreteViewShadowNode<
          RNSModalScreenComponentName,
          RNSScreenProps,
          RNSScreenEventEmitter,
          RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  // Like `setSize`, but leaves the Yoga node clean when the size is unchanged.
  // See `rnscreens::yogaStyleHasSize`.
  void setSizeIfChanged(Size size) const {
    if (!rnscreens::yogaStyleHasSize(yogaNode_.style(), size)) {
      setSize(size);
    }
  }

  Point getContentOriginOffset(bool includeTransform) const override;
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace react
} // namespace facebook
