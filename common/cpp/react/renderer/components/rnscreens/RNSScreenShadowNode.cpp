#include <react/renderer/core/ComponentDescriptor.h>

#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

extern const char RNSScreenComponentName[] = "RNSScreen";

const ShadowNodeFragment::Value RNSScreenShadowNode::updateFragmentProps(ShadowNodeFragment const &fragment, ShadowNodeFamily const &family) {
    const auto oldProps = std::dynamic_pointer_cast<const RNSScreenProps>(fragment.props);
        
    auto context = PropsParserContext(family.getSurfaceId(), *family.getComponentDescriptor().getContextContainer());
#ifdef ANDROID
    auto dynamic = oldProps == nullptr ? folly::dynamic::object() : oldProps->rawProps;
    auto rawProps = RawProps(dynamic);
#else
    auto rawProps = RawProps(folly::dynamic::object());
#endif
    auto newProps = family.getComponentDescriptor().cloneProps(context, oldProps, std::move(rawProps));

    // we pass the pointer to the ShadowNodeFamily in the initial state, so it's propagated on every clone
    // we need it to clear the reference in the registry when the view is removed from window
    // it cannot be done in the destructor, as multiple shadow nodes for the same family may be created
    return ShadowNodeFragment::Value({
        .props = newProps,
        .children = fragment.children,
        .state = fragment.state,
    });
}

Point RNSScreenShadowNode::getContentOriginOffset() const {
  auto stateData = getStateData();
  auto contentOffset = stateData.contentOffset;
  return {contentOffset.x, contentOffset.y};
}

} // namespace react
} // namespace facebook
