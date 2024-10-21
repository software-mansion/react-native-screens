/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFullWindowOverlayShadowNode.h"

namespace facebook::react {

/*
 * Descriptor for <RNSFullWindowOverlay> component.
 */

class RNSFullWindowOverlayComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFullWindowOverlayShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(shadowNode);
    auto &stateData =
        static_cast<const RNSFullWindowOverlayShadowNode::ConcreteState &>(
            *shadowNode.getState())
            .getData();

    layoutableShadowNode.setSize(
        Size{stateData.screenSize.width, stateData.screenSize.height});
    layoutableShadowNode.setPositionType(YGPositionTypeAbsolute);

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react