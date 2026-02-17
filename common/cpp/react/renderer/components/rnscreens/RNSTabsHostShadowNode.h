#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSTabsHostState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSTabsHostComponentName[];

class JSI_EXPORT RNSTabsHostShadowNode final : public ConcreteViewShadowNode<
                                                   RNSTabsHostComponentName,
                                                   RNSTabsHostProps,
                                                   RNSTabsHostEventEmitter,
                                                   RNSTabsHostState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - Custom interface

#if !defined(ANDROID)
  void setImageLoader(std::weak_ptr<void> imageLoader);

 private:
  StateData &getStateDataMutable();
#endif // !ANDROID
};

} // namespace facebook::react
