package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * The operation FragmentManager is about to execute.
 */
internal class StackOperationContext(
    internal val kind: StackOperationKind,
    /** The top FragmentManager shows before the operation. */
    internal val outgoing: StackScreenFragment,
    /** The top after the operation. */
    internal val incoming: StackScreenFragment,
)
