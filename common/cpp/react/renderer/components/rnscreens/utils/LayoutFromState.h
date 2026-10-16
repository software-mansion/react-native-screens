#pragma once

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

} // namespace rnscreens
