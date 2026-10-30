package com.swmansion.rnscreens.core.containers.stack.animation.timeline

/**
 * Where the disappearing screen of a transition is drawn relative to the other screen; derived
 * from the transition kind by `TransitionTimeline.of`.
 */
internal enum class ZOrder {
    UNDER,
    OVER,
}
