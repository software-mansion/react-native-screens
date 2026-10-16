#pragma once

#include <react/renderer/core/LayoutPrimitives.h>
#include <react/renderer/graphics/Point.h>
#include <react/renderer/graphics/Size.h>
#include <yoga/style/Style.h>

namespace rnscreens {

namespace react = facebook::react;
namespace yoga = facebook::yoga;

/**
 * Base for shadow nodes whose component descriptor sets their Yoga size from
 * native state in `adopt()`. It goes between the node and its concrete base:
 * `SizeFromStateShadowNode<ConcreteViewShadowNode<...>>`.
 */
template <typename BaseShadowNodeT>
class SizeFromStateShadowNode : public BaseShadowNodeT {
 public:
  using BaseShadowNodeT::BaseShadowNodeT;

  /**
   * Like `setSize`, but leaves the Yoga node clean when its style already has
   * the given width and height.
   *
   * `setSize` marks the Yoga node dirty even when the size is unchanged, and
   * `adopt()` runs on every clone. Every commit clones the path from the
   * changed node to the root, so calling `setSize` there unconditionally makes
   * the root re-run layout and pixel-grid rounding over the whole tree on every
   * commit, including ones that change nothing layout-related (scroll offset
   * state updates, animated transforms).
   *
   * An undefined size (NaN) maps to an undefined `StyleSizeLength`, and
   * undefined values compare equal, so resetting the size to undefined only
   * dirties the node the first time.
   */
  void setSizeIfChanged(react::Size size) const {
    const yoga::Style &style = this->yogaNode_.style();
    const bool hasSize = style.dimension(yoga::Dimension::Width) ==
            yoga::StyleSizeLength::points(size.width) &&
        style.dimension(yoga::Dimension::Height) ==
            yoga::StyleSizeLength::points(size.height);
    if (!hasSize) {
      this->setSize(size);
    }
  }
};

/**
 * Marks the node's layout dirty when the frame origin its `layout()` override
 * would set differs from the one in its current layout metrics.
 *
 * Some nodes overwrite the frame origin computed by Yoga with one that native
 * reports through state, in `layout()`. Fabric only calls `layout()` on a node
 * that has new layout from Yoga, and a state update doesn't dirty the Yoga
 * node, so a state update that only moves the node would otherwise leave its
 * shadow tree origin stale. That's what `measure()` and Pressability's
 * press-rect checks read.
 *
 * A clone inherits the layout metrics of its source, with the correction
 * already applied, so a clone whose state origin didn't change stays clean.
 *
 * Call it from the component descriptor's `adopt()`. `ShadowNodeT` must have a
 * `Point correctFrameOrigin(Point origin) const` method, which `layout()` uses
 * to correct the origin too.
 */
template <typename ShadowNodeT>
void dirtyLayoutIfFrameOriginStale(ShadowNodeT &shadowNode) {
  const auto layoutMetrics = shadowNode.getLayoutMetrics();
  if (layoutMetrics.displayType == react::DisplayType::None) {
    // `layout()` isn't called on hidden nodes, so this couldn't correct it.
    return;
  }
  const auto origin = layoutMetrics.frame.origin;
  if (shadowNode.correctFrameOrigin(origin) != origin) {
    shadowNode.dirtyLayout();
  }
}

} // namespace rnscreens
