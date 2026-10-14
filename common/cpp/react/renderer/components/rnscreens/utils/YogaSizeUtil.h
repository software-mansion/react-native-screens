#pragma once

#include <react/renderer/components/view/YogaLayoutableShadowNode.h>
#include <react/renderer/graphics/Size.h>

namespace rnscreens {

namespace react = facebook::react;
namespace yoga = facebook::yoga;

/**
 * Whether the Yoga style already has the given width and height, as set by
 * `YogaLayoutableShadowNode::setSize`.
 *
 * `setSize` marks the Yoga node dirty even when the size is unchanged.
 * Component descriptors call it from `adopt`, which runs on every clone, and
 * every commit clones the path from the changed node to the root. Calling it
 * unconditionally therefore makes the root re-run layout and pixel-grid
 * rounding over the whole tree on every commit, including ones that change
 * nothing layout-related (scroll offset state updates, animated transforms).
 */
inline bool yogaStyleHasSize(
    const yoga::Style &style,
    const react::Size &size) {
  return style.dimension(yoga::Dimension::Width) ==
      yoga::StyleSizeLength::points(size.width) &&
      style.dimension(yoga::Dimension::Height) ==
      yoga::StyleSizeLength::points(size.height);
}

} // namespace rnscreens
