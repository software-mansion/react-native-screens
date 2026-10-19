package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

internal enum class StackTransitionKind {
    PUSH,
    POP,
    REPLACE,
}

/**
 * The operation FragmentManager is about to execute. Consulted only for the two fragments it
 * names, each in its own role: [outgoing] when its view disappears, [incoming] when it appears.
 */
internal class StackTransitionContext(
    /** From the container's own pending operations, never from FragmentManager's classification. */
    internal val kind: StackTransitionKind,
    /** The top FragmentManager shows before the operation. */
    internal val outgoing: StackScreenFragment,
    /** The top after the operation. */
    internal val incoming: StackScreenFragment,
)
