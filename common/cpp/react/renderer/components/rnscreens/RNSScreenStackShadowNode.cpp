#include "RNSScreenStackShadowNode.h"

#include <react/renderer/core/LayoutMetrics.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/components/view/conversions.h>
#include "RNSScreenShadowNode.h"

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook::react {

const char RNSScreenStackComponentName[] = "RNSScreenStack";

YogaLayoutableShadowNode& shadowNodeFromContext2(
    YGNodeConstRef yogaNode) {
  return dynamic_cast<YogaLayoutableShadowNode&>(
      *static_cast<ShadowNode*>(YGNodeGetContext(yogaNode)));
}

static EdgeInsets calculateOverflowInset(
    Rect contentFrame,
    Rect contentBounds) {
  auto size = contentFrame.size;
  auto overflowInset = EdgeInsets{};
  overflowInset.left = std::min(contentBounds.getMinX(), Float{0.0});
  overflowInset.top = std::min(contentBounds.getMinY(), Float{0.0});
  overflowInset.right =
      -std::max(contentBounds.getMaxX() - size.width, Float{0.0});
  overflowInset.bottom =
      -std::max(contentBounds.getMaxY() - size.height, Float{0.0});
  return overflowInset;
}

void RNSScreenStackShadowNode::layout(LayoutContext layoutContext) {
  // Reading data from a dirtied node does not make sense.
  react_native_assert(!yogaNode_.isDirty());

  for (auto childYogaNode : yogaNode_.getChildren()) {
    auto& childNode = shadowNodeFromContext2(childYogaNode);

    // Verifying that the Yoga node belongs to the ShadowNode.
//    react_native_assert(&childNode.yogaNode_ == childYogaNode);

    if (childYogaNode->getHasNewLayout()) {
      childYogaNode->setHasNewLayout(false);

      // Reading data from a dirtied node does not make sense.
      react_native_assert(!childYogaNode->isDirty());

      // We must copy layout metrics from Yoga node only once (when the parent
      // node exclusively ownes the child node).
      react_native_assert(childYogaNode->getOwner() == &yogaNode_);

      // We are about to mutate layout metrics of the node.
      childNode.ensureUnsealed();

      auto newLayoutMetrics = layoutMetricsFromYogaNode(*childYogaNode);
      newLayoutMetrics.pointScaleFactor = layoutContext.pointScaleFactor;
      newLayoutMetrics.wasLeftAndRightSwapped =
          layoutContext.swapLeftAndRightInRTL &&
          newLayoutMetrics.layoutDirection == LayoutDirection::RightToLeft;

      // Child node's layout has changed. When a node is added to
      // `affectedNodes`, onLayout event is called on the component. Comparing
      // `newLayoutMetrics.frame` with `childNode.getLayoutMetrics().frame` to
      // detect if layout has not changed is not advised, please refer to
      // D22999891 for details.
      if (layoutContext.affectedNodes != nullptr) {
        layoutContext.affectedNodes->push_back(&childNode);
      }


      if (std::strcmp(childNode.getComponentName(), "RNSScreen") == 0) {
        auto &screenShadowNode = static_cast<RNSScreenShadowNode &>(childNode);
        const auto &state = std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(screenShadowNode.getState());
        auto stateData = state->getData();
//        stateData.frameSize
        layoutContext.viewportOffset = {0, stateData.headerOffset};
        newLayoutMetrics.frame.origin.y += stateData.headerOffset;
        newLayoutMetrics.frame.size.height -= stateData.headerOffset;
        childNode.setLayoutMetrics(newLayoutMetrics);
      } else {
        childNode.setLayoutMetrics(newLayoutMetrics);
      }

      if (newLayoutMetrics.displayType != DisplayType::None) {
        childNode.layout(layoutContext);
      }
    }
  }

  if (yogaNode_.style().overflow() == yoga::Overflow::Visible) {
    // Note that the parent node's overflow layout is NOT affected by its
    // transform matrix. That transform matrix is applied on the parent node as
    // well as all of its child nodes, which won't cause changes on the
    // overflowInset values. A special note on the scale transform -- the scaled
    // layout may look like it's causing overflowInset changes, but it's purely
    // cosmetic and will be handled by pixel density conversion logic later when
    // render the view. The actual overflowInset value is not changed as if the
    // transform is not happening here.
    auto contentBounds = getContentBounds();
    layoutMetrics_.overflowInset =
        calculateOverflowInset(layoutMetrics_.frame, contentBounds);
  } else {
    layoutMetrics_.overflowInset = {};
  }
}

} // namespace facebook::react