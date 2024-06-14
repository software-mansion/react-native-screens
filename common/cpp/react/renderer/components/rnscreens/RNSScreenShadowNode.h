#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
#include "HeaderCorrectionModes.h"
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
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

#pragma mark - ShadowNode overrides

  Point getContentOriginOffset() const override;

  void layout(LayoutContext layoutContext) override;

#pragma mark - Custom interface

  void setHeaderHeight(float headerHeight);

  HeaderCorrectionModes &getHeaderCorrectionModes();

 private:
#ifdef ANDROID
  void applyFrameCorrections();

  StateData &getStateDataMutable();
#endif // ANDROID
};

} // namespace react
} // namespace facebook
