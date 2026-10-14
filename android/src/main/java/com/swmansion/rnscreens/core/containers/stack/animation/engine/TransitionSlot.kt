package com.swmansion.rnscreens.core.containers.stack.animation.engine

/**
 * The four fragment transition slots. Only one bit of a slot matters to the animation code:
 * whether the fragment's view is appearing (`enter`, `reenter`) or disappearing (`exit`,
 * `return`); FragmentManager's push / pop half of the name is never consulted.
 */
internal enum class TransitionSlot(
    internal val isAppearing: Boolean,
) {
    ENTER(isAppearing = true),
    EXIT(isAppearing = false),
    RETURN(isAppearing = false),
    REENTER(isAppearing = true),
}
