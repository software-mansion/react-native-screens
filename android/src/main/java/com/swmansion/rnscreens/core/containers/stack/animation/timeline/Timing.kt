package com.swmansion.rnscreens.core.containers.stack.animation.timeline

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import kotlin.math.roundToLong

/**
 * When a track runs on its screen's timeline, in absolute milliseconds, and with which curve.
 */
internal data class Timing(
    val startMs: Long,
    val durationMs: Long,
    val easing: Easing,
) {
    init {
        require(startMs >= 0L && durationMs >= 0L) { "[RNScreens] A track cannot start or last a negative time." }
    }

    internal val endMs: Long
        get() = startMs + durationMs

    internal fun scaled(factor: Float): Timing =
        copy(
            startMs = (startMs * factor).roundToLong(),
            durationMs = (durationMs * factor).roundToLong(),
        )

    internal fun withEasing(easing: Easing): Timing = copy(easing = easing)

    /**
     * Linear 0..1 progress at a time on the screen's timeline, clamped; a 0 ms span is a step.
     */
    internal fun progressAt(timeMs: Float): Float =
        if (durationMs == 0L) {
            if (timeMs < startMs) 0f else 1f
        } else {
            ((timeMs - startMs) / durationMs).coerceIn(0f, 1f)
        }
}
