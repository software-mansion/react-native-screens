package com.swmansion.rnscreens.core.containers.stack.animation

import androidx.transition.Transition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * The question a fragment asks its container when FragmentManager reads one of its
 * transition slots: "which transition do I play in this slot right now?". The container
 * answers from the operation it is executing and the screens' configs; `null` means no
 * transition (and no seeking for that batch).
 */
internal fun interface ScreenTransitionProviding {
    fun transitionFor(
        fragment: StackScreenFragment,
        slot: TransitionSlot,
    ): Transition?
}
