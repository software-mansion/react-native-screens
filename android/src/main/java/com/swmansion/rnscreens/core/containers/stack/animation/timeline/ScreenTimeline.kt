package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing

/**
 * One screen's side of a transition: its tracks and how long the screen must stay hosted.
 */
internal class ScreenTimeline private constructor(
    internal val tracks: List<Track>,
    internal val durationMs: Long,
) {
    internal fun withEasing(easing: Easing): ScreenTimeline =
        ScreenTimeline(tracks.map { it.withTiming(it.timing.withEasing(easing)) }, durationMs)

    override fun toString(): String = "ScreenTimeline(${durationMs}ms, ${tracks.size} tracks)"

    companion object {
        internal fun static(durationMs: Long): ScreenTimeline = ScreenTimeline(emptyList(), durationMs)

        /**
         * Both sides of a transition must last the whole transition: androidx clamps each animator
         * to its own duration under a seek, so a side ending early would leave the overlay early.
         */
        internal fun spanning(
            tracks: List<Track>,
            durationMs: Long,
        ): ScreenTimeline {
            require(tracks.all { it.timing.endMs <= durationMs }) {
                "[RNScreens] A track cannot end after its screen timeline."
            }
            return ScreenTimeline(tracks, durationMs)
        }
    }
}
