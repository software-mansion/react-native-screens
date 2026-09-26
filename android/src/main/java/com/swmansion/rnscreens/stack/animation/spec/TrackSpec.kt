package com.swmansion.rnscreens.stack.animation.spec

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

internal data class TrackSpec(
    val property: TrackProperty,
    val from: Value,
    val to: Value,
    override val startMs: Long,
    override val durationMs: Long,
    val easing: Easing,
    /**
     * Negate the values when the container is laid out right-to-left.
     */
    val mirrorInRtl: Boolean,
) : TimedSpan
