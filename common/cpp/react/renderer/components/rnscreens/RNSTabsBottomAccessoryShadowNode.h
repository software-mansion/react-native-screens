#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSTabsBottomAccessoryState.h"
#include "utils/YogaSizeUtil.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSTabsBottomAccessoryComponentName[];

class JSI_EXPORT RNSTabsBottomAccessoryShadowNode final
    : public ConcreteViewShadowNode<
          RNSTabsBottomAccessoryComponentName,
          RNSTabsBottomAccessoryProps,
          RNSTabsBottomAccessoryEventEmitter,
          RNSTabsBottomAccessoryState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  // Like `setSize`, but leaves the Yoga node clean when the size is unchanged.
  // See `rnscreens::yogaStyleHasSize`.
  void setSizeIfChanged(Size size) const {
    if (!rnscreens::yogaStyleHasSize(yogaNode_.style(), size)) {
      setSize(size);
    }
  }

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset(bool includeTransform) const override;

  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface
 private:
  void applyFrameCorrections();
};

} // namespace facebook::react
