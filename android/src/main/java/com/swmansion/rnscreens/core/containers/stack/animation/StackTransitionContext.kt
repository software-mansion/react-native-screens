package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

internal enum class StackTransitionKind {
    PUSH,
    POP,
    REPLACE,
}

/**
 * The operation FragmentManager is about to execute.
 */
internal class StackTransitionContext(
    internal val kind: StackTransitionKind,
    /** The top FragmentManager shows before the operation. */
    internal val outgoing: StackScreenFragment,
    /** The top after the operation. */
    internal val incoming: StackScreenFragment,
)
