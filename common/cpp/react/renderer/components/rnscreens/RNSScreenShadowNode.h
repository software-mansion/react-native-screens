#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/LayoutMetrics.h>
#include "RNSScreenState.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSScreenComponentName[];

class JSI_EXPORT RNSScreenShadowNode final : public ConcreteViewShadowNode<
                                                 RNSScreenComponentName,
                                                 RNSScreenProps,
                                                 RNSScreenEventEmitter,
                                                 RNSScreenState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using PropsT = ConcreteViewShadowNode::ConcreteProps;

  Point getContentOriginOffset() const override;

  void setTopMargin(float marginTop);

  void layout(facebook::react::LayoutContext layoutContext) override;

 private:
  constexpr PropsT &getConcretePropsMut();
};

} // namespace react
} // namespace facebook
