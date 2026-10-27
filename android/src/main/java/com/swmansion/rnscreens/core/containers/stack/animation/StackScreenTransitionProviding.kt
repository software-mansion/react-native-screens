package com.swmansion.rnscreens.core.containers.stack.animation

import androidx.transition.Transition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.StackTransitionSlot
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * Answers a fragment's transition getters: the transition it plays in a slot right now; `null`
 * is none (and no seeking for that batch).
 */
internal fun interface StackScreenTransitionProviding {
    fun transitionFor(
        fragment: StackScreenFragment,
        slot: StackTransitionSlot,
    ): Transition?
}
