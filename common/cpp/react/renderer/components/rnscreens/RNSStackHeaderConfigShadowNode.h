#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSStackHeaderConfigState.h"
#include "utils/LayoutFromState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSStackHeaderConfigComponentName[];

class JSI_EXPORT RNSStackHeaderConfigShadowNode final
    : public rnscreens::SizeFromStateShadowNode<ConcreteViewShadowNode<
          RNSStackHeaderConfigComponentName,
#if !defined(ANDROID)
          RNSStackHeaderConfigIOSProps,
          RNSStackHeaderConfigIOSEventEmitter,
#else // !defined(ANDROID)
          RNSStackHeaderConfigAndroidProps,
          RNSStackHeaderConfigAndroidEventEmitter,
#endif // !defined(ANDROID)
          RNSStackHeaderConfigState>> {
 public:
  using SizeFromStateShadowNode::SizeFromStateShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#ifdef ANDROID
  Point getContentOriginOffset(bool includeTransform) const override;
#else // ANDROID
  void layout(LayoutContext layoutContext) override;

  /**
   * The frame origin `layout()` sets, given the one computed by Yoga. The
   * component descriptor compares it with the current layout metrics.
   */
  Point correctFrameOrigin(Point origin) const;

  void setImageLoader(std::weak_ptr<void> imageLoader);

 private:
  void applyFrameCorrections();
  StateData &getStateDataMutable();
#endif // ANDROID
};

} // namespace facebook::react
