package com.swmansion.rnscreens.stack.animation.spec

/**
 * A sub-span of a slot's timeline.
 */
internal interface TimedSpan {
    val startMs: Long
    val durationMs: Long

    val endMs: Long
        get() = startMs + durationMs

    /**
     * Linear 0..1 progress of this span at a slot-master time, clamped.
     */
    fun fractionAt(timeMs: Float): Float =
        if (durationMs == 0L) {
            if (timeMs < startMs) 0f else 1f
        } else {
            ((timeMs - startMs) / durationMs).coerceIn(0f, 1f)
        }
}
