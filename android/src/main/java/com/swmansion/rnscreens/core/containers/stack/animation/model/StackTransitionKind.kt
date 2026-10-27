package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * The two transitions every animation defines: the one played when the screen is pushed and the
 * one played when it is popped. A replace plays one of the two, see `replaceAnimation`.
 */
internal enum class StackTransitionKind {
    PUSH,
    POP,
}
