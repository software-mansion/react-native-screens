#pragma once

#include <jsi/jsi.h>
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSScreenStackState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSScreenStackComponentName[];

class JSI_EXPORT RNSScreenStackShadowNode final : public ConcreteViewShadowNode<
                                                      RNSScreenStackComponentName,
                                                      RNSScreenStackProps,
                                                      RNSScreenStackEventEmitter,
                                                      RNSScreenStackState>{
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  void layout(facebook::react::LayoutContext layoutContext) override;
};
}
