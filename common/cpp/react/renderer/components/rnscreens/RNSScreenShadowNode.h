#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnscreens/EventEmitters.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/LayoutableShadowNode.h>
#include <react/renderer/core/LayoutContext.h>
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

            Point getContentOriginOffset() const override;

            void layout(facebook::react::LayoutContext layoutContext) override;

            Size measure(const LayoutContext &layoutContext,
                         const LayoutConstraints &layoutConstraints) const override;

            Size measureContent(const LayoutContext &layoutContext,
                                const LayoutConstraints &layoutConstraints) const override;
        };

    } // namespace react
} // namespace facebook
