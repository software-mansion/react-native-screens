package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length

/**
 * A value interpolated on the screen's timeline. A translation, a view property and a dim are
 * one kind of thing to the engine: a `from`, a `to`, a [Timing] and a target.
 */
internal sealed interface Track {
    val timing: Timing

    fun withTiming(timing: Timing): Track

    data class Translate(
        val axis: Axis,
        val from: Length,
        val to: Length,
        override val timing: Timing,
    ) : Track {
        override fun withTiming(timing: Timing): Track = copy(timing = timing)
    }

    data class Property(
        val property: ViewProperty,
        val from: Float,
        val to: Float,
        override val timing: Timing,
    ) : Track {
        override fun withTiming(timing: Timing): Track = copy(timing = timing)
    }

    /**
     * A scrim of [color] over the screen, its alpha interpolated from [from] to [to].
     */
    data class Dim(
        val color: Int,
        val from: Float,
        val to: Float,
        override val timing: Timing,
    ) : Track {
        override fun withTiming(timing: Timing): Track = copy(timing = timing)
    }
}

internal fun List<Track>.scaled(factor: Float): List<Track> = map { it.withTiming(it.timing.scaled(factor)) }

internal fun List<Track>.withEasing(easing: Easing): List<Track> = map { it.withTiming(it.timing.withEasing(easing)) }

/**
 * Every track scaled so the last one ends at [durationMs]. A list ending at 0 ms, without tracks
 * or with only steps at its start, has nothing to scale.
 */
internal fun List<Track>.retimed(durationMs: Long): List<Track> = if (endMs == 0L) this else scaled(durationMs.toFloat() / endMs)

/**
 * When the last track ends; 0 without tracks.
 */
internal val List<Track>.endMs: Long
    get() = maxOfOrNull { it.timing.endMs } ?: 0L
