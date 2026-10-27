package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import kotlin.math.roundToLong

// Taken from the legacy implementation's `rns_no_animation_20.xml`: "non-zero duration ensures
// transition events are triggered correctly". A 0 ms transition would also complete a
// predictive-back pop at gesture start and destroy the fragment before FragmentManager commits
// it; 1 ms already avoids that, 20 keeps the legacy value.
private const val NONE_DURATION_MS = 20L

/**
 * What both screens of one transition do: [enter] is the motion of the screen whose view appears,
 * [exit] of the screen whose view disappears, drawn in [exitZOrder] relative to the other.
 */
internal data class TransitionTimeline(
    val enter: MotionTimeline,
    val exit: MotionTimeline,
    val exitZOrder: ZOrder,
) {
    internal val durationMs: Long
        get() = maxOf(enter.durationMs, exit.durationMs)

    init {
        require(durationMs > 0L) { "[RNScreens] A transition must have a positive duration." }
    }

    /**
     * Both motions re-spanned to the scaled duration, which is re-derived from the scaled tracks
     * so that rounding can never leave a track past the end. A timeline without tracks has
     * nothing to re-derive it from, so its span is scaled directly.
     */
    internal fun scaled(factor: Float): TransitionTimeline =
        if (enter.tracks.isEmpty() && exit.tracks.isEmpty()) {
            val durationMs = (durationMs * factor).roundToLong().coerceAtLeast(1L)
            TransitionTimeline(MotionTimeline.static(durationMs), MotionTimeline.static(durationMs), exitZOrder)
        } else {
            of(enter.tracks.scaled(factor), exit.tracks.scaled(factor), exitZOrder)
        }

    internal fun withEasing(easing: Easing): TransitionTimeline = copy(enter = enter.withEasing(easing), exit = exit.withEasing(easing))

    companion object {
        /**
         * The transition of [kind] playing [enter] on the appearing screen and [exit] on the
         * disappearing one. On a push the covered screen is drawn under the entering one; on a
         * pop the popped screen stays on top of the revealed one.
         */
        internal fun of(
            kind: StackTransitionKind,
            enter: List<Track>,
            exit: List<Track>,
        ): TransitionTimeline =
            of(
                enter,
                exit,
                when (kind) {
                    StackTransitionKind.PUSH -> ZOrder.UNDER
                    StackTransitionKind.POP -> ZOrder.OVER
                },
            )

        /**
         * The transition lasts as long as its longest track; a screen without tracks is static,
         * spanning it. A transition without any track (`none` at any level) lasts
         * [NONE_DURATION_MS].
         */
        private fun of(
            enterTracks: List<Track>,
            exitTracks: List<Track>,
            exitZOrder: ZOrder,
        ): TransitionTimeline {
            val tracks = enterTracks + exitTracks
            // A rescaled motion can round every track to 0 ms; the transition must stay positive.
            val durationMs = if (tracks.isEmpty()) NONE_DURATION_MS else tracks.endMs.coerceAtLeast(1L)
            return TransitionTimeline(
                enter = MotionTimeline.spanning(enterTracks, durationMs),
                exit = MotionTimeline.spanning(exitTracks, durationMs),
                exitZOrder = exitZOrder,
            )
        }
    }
}
