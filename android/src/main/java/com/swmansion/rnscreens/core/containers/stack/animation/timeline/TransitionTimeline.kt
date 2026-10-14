package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import kotlin.math.roundToLong

/**
 * What both screens of one operation do: [enter] is the side whose view appears, [exit] the side
 * whose view disappears. On a push FragmentManager reads them from the `enter` / `exit` fragment
 * slots, on a pop from `reenter` / `return`, Android's own "reverse of enter / exit".
 */
internal data class TransitionTimeline(
    val enter: ScreenTimeline,
    val exit: ScreenTimeline,
    val exitZOrder: ZOrder,
) {
    internal val durationMs: Long
        get() = maxOf(enter.durationMs, exit.durationMs)

    init {
        require(durationMs > 0L) { "[RNScreens] A transition must have a positive duration." }
    }

    /**
     * Both sides re-spanned to the scaled duration, which is re-derived from the scaled tracks
     * so that rounding can never leave a track past the end.
     */
    internal fun scaled(factor: Float): TransitionTimeline =
        if (enter.tracks.isEmpty() && exit.tracks.isEmpty()) {
            static((durationMs * factor).roundToLong().coerceAtLeast(1L), exitZOrder)
        } else {
            of(
                enter.tracks.map { it.withTiming(it.timing.scaled(factor)) },
                exit.tracks.map { it.withTiming(it.timing.scaled(factor)) },
                exitZOrder,
            )
        }

    internal fun withEasing(easing: Easing): TransitionTimeline = copy(enter = enter.withEasing(easing), exit = exit.withEasing(easing))

    companion object {
        /**
         * The transition lasts as long as its longest track; a side without tracks is a static
         * screen spanning it.
         */
        internal fun of(
            enterTracks: List<Track>,
            exitTracks: List<Track>,
            exitZOrder: ZOrder,
        ): TransitionTimeline {
            val durationMs = (enterTracks + exitTracks).maxOfOrNull { it.timing.endMs } ?: 0L
            return TransitionTimeline(
                enter = ScreenTimeline.spanning(enterTracks, durationMs),
                exit = ScreenTimeline.spanning(exitTracks, durationMs),
                exitZOrder = exitZOrder,
            )
        }

        internal fun static(
            durationMs: Long,
            exitZOrder: ZOrder,
        ): TransitionTimeline = TransitionTimeline(ScreenTimeline.static(durationMs), ScreenTimeline.static(durationMs), exitZOrder)
    }
}
