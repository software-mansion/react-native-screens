package com.swmansion.rnscreens.core.containers.stack.animation.engine

/**
 * The four fragment transition slots: FragmentManager uses `enter` / `exit` on a push and
 * `reenter` / `return` on a pop. Only whether the fragment's view appears or disappears matters
 * here; the push / pop half is never consulted, the container's context says which operation runs.
 */
internal enum class StackTransitionSlot(
    internal val isAppearing: Boolean,
) {
    ENTER(isAppearing = true),
    EXIT(isAppearing = false),
    RETURN(isAppearing = false),
    REENTER(isAppearing = true),
}
