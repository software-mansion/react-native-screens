#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSTabsScreenShadowNode.h"

namespace facebook::react {

class RNSTabsScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSTabsScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    auto &tabScreen = static_cast<RNSTabsScreenShadowNode &>(shadowNode);
    const auto &stateData = tabScreen.getStateData();
    if (stateData.frameSize.width > 0 && stateData.frameSize.height > 0) {
      tabScreen.setSize(stateData.frameSize);
    }
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
