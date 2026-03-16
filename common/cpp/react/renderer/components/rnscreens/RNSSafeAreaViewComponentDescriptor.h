// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#pragma once

#include <react/renderer/components/rnscreens/RNSSafeAreaViewShadowNode.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

/*
 * Descriptor for <RNSSafeAreaView> component.
 */
class RNSSafeAreaViewComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSSafeAreaViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSSafeAreaViewShadowNode *>(&shadowNode));

    auto &concreteShadowNode =
        static_cast<RNSSafeAreaViewShadowNode &>(shadowNode);
    concreteShadowNode.adjustLayoutWithState();

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
