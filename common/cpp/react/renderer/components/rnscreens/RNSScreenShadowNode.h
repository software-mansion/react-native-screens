#pragma once

#include "RNSScreenState.h"
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSScreenComponentName[];

class JSI_EXPORT RNSScreenShadowNode final : public ConcreteViewShadowNode<
                                          RNSScreenComponentName,
                                          RNSScreenProps,
                                          RNSScreenEventEmitter,
                                          RNSScreenState> {
                                          public:
                                              RNSScreenShadowNode(
                                                     ShadowNodeFragment const &fragment,
                                                     ShadowNodeFamily::Shared const &family,
                                                     ShadowNodeTraits traits)
                                                     : ConcreteViewShadowNode(static_cast<ShadowNodeFragment>(updateFragmentProps(fragment, *family)), family, traits) {
                                                         
                                                     }

                                              RNSScreenShadowNode(
                                                     ShadowNode const &sourceShadowNode,
                                                     ShadowNodeFragment const &fragment)
                                                     : ConcreteViewShadowNode(sourceShadowNode, static_cast<ShadowNodeFragment>(updateFragmentProps(fragment, sourceShadowNode.getFamily()))) {}
                                              
                                              Point getContentOriginOffset() const override;

                                          private:
                                                 static const ShadowNodeFragment::Value updateFragmentProps(ShadowNodeFragment const &fragment, ShadowNodeFamily const &family);
                                              
};

} // namespace react
} // namespace facebook
