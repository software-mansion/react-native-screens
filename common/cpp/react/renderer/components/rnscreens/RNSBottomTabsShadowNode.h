#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "RNSBottomTabsState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSBottomTabsComponentName[];

class JSI_EXPORT RNSBottomTabsShadowNode final : public ConcreteViewShadowNode<
                                                     RNSBottomTabsComponentName,
                                                     RNSBottomTabsProps,
                                                     RNSBottomTabsEventEmitter,
                                                     RNSBottomTabsState> {
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
