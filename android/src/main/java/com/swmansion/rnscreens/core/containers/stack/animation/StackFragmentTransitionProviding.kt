package com.swmansion.rnscreens.core.containers.stack.animation

import androidx.transition.Transition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.StackFragmentTransitionSlot
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * Answers a fragment's transition getters: the fragment transition it plays in a slot right now;
 * `null` is none (and no seeking for that batch).
 */
internal fun interface StackFragmentTransitionProviding {
    fun fragmentTransitionFor(
        fragment: StackScreenFragment,
        slot: StackFragmentTransitionSlot,
    ): Transition?
}
