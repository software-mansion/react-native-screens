#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "FrameCorrectionModes.h"
#include "RNSScreenStackHeaderConfigState.h"

namespace facebook::react {

using namespace rnscreens;

JSI_EXPORT extern const char RNSScreenStackHeaderConfigComponentName[];

class JSI_EXPORT RNSScreenStackHeaderConfigShadowNode final
    : public ConcreteViewShadowNode<
          RNSScreenStackHeaderConfigComponentName,
          RNSScreenStackHeaderConfigProps,
          RNSScreenStackHeaderConfigEventEmitter,
          RNSScreenStackHeaderConfigState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - ShadowNode overrides
  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface

#if !defined(ANDROID)
  void setImageLoader(std::weak_ptr<void> imageLoader);
#endif // !ANDROID && !NDEBUG

 private:
  void applyFrameCorrections();

#if !defined(ANDROID)
  StateData &getStateDataMutable();
#endif // !ANDROID && !NDEBUG
};

} // namespace facebook::react
