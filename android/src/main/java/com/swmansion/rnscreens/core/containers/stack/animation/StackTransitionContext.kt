package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

internal enum class StackTransitionKind {
    PUSH,
    POP,
    REPLACE,
}

/**
 * The operation this container most recently committed, as a note for the transition reads
 * FragmentManager makes while executing it. It is consulted only for the two fragments it
 * names, each only in its own role: [outgoing] when its view disappears, [incoming] when its
 * view appears. Every other read is answered from the screens' own configs.
 */
internal class StackTransitionContext(
    /** From the container's own pending operations, never from FragmentManager's classification. */
    internal val kind: StackTransitionKind,
    /** The top FragmentManager still shows when the operation executes. */
    internal val outgoing: StackScreenFragment,
    /** The top after the operation. */
    internal val incoming: StackScreenFragment,
)
