// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/RNSSafeAreaViewState.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSSafeAreaViewComponentName[];

/*
 * `ShadowNode` for <RNSSafeAreaView> component.
 */
class JSI_EXPORT RNSSafeAreaViewShadowNode final
    : public ConcreteViewShadowNode<
          RNSSafeAreaViewComponentName,
          RNSSafeAreaViewProps,
          ViewEventEmitter,
          RNSSafeAreaViewState> {
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

 public:
  void adjustLayoutWithState();
};

} // namespace react
} // namespace facebook
