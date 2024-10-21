/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "RNSFullWindowOverlayState.h"

namespace facebook::react {

extern const char RNSFullWindowOverlayComponentName[];

/*
 * `ShadowNode` for <RNSFullWindowOverlay> component.
 */
class RNSFullWindowOverlayShadowNode final
    : public ConcreteViewShadowNode<
          RNSFullWindowOverlayComponentName,
          RNSFullWindowOverlayProps,
          RNSFullWindowOverlayEventEmitter,
          RNSFullWindowOverlayState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace facebook::react