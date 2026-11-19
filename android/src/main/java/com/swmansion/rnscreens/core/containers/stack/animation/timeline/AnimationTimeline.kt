package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind

/**
 * Both transitions of one animation, in absolute milliseconds. The reference duration a
 * `duration` option rescales against is derived: the longer of the two.
 */
internal data class AnimationTimeline(
    val push: TransitionTimeline,
    val pop: TransitionTimeline,
) {
    internal val referenceDurationMs: Long
        get() = maxOf(push.durationMs, pop.durationMs)

    internal fun transition(kind: StackTransitionKind): TransitionTimeline =
        when (kind) {
            StackTransitionKind.PUSH -> push
            StackTransitionKind.POP -> pop
        }

    /**
     * Both transitions scaled by the same factor, so the animation's own asymmetry survives.
     */
    internal fun retimed(durationMs: Long): AnimationTimeline {
        val factor = durationMs.toFloat() / referenceDurationMs
        return AnimationTimeline(push.scaled(factor), pop.scaled(factor))
    }

    /**
     * Every track of both transitions on one curve, the dim included.
     */
    internal fun withEasing(easing: Easing): AnimationTimeline = AnimationTimeline(push.withEasing(easing), pop.withEasing(easing))
}
