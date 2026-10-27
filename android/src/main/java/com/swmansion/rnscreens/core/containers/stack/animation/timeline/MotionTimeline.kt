package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing

/**
 * One screen's motion in a transition: its tracks and how long the screen must stay hosted.
 */
internal class MotionTimeline private constructor(
    internal val tracks: List<Track>,
    internal val durationMs: Long,
) {
    internal fun withEasing(easing: Easing): MotionTimeline = MotionTimeline(tracks.withEasing(easing), durationMs)

    override fun toString(): String = "MotionTimeline(${durationMs}ms, ${tracks.size} tracks)"

    companion object {
        internal fun static(durationMs: Long): MotionTimeline = MotionTimeline(emptyList(), durationMs)

        /**
         * Both screens of a transition must last the whole transition: androidx clamps each animator
         * to its own duration under a seek, so a screen ending early would leave the overlay early.
         */
        internal fun spanning(
            tracks: List<Track>,
            durationMs: Long,
        ): MotionTimeline {
            require(tracks.all { it.timing.endMs <= durationMs }) {
                "[RNScreens] A track cannot end after its motion timeline."
            }
            return MotionTimeline(tracks, durationMs)
        }
    }
}
