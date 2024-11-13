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

#pragma mark - Custom interface
#if !defined(ANDROID) && !defined(NDEBUG)
  void setImageLoader(std::weak_ptr<void> imageLoader);
#endif // !ANDROID && !NDEBUG

 private:
#if !defined(ANDROID) && !defined(NDEBUG)
  StateData &getStateDataMutable();
#endif // !ANDROID && !NDEBUG
};

} // namespace facebook::react
