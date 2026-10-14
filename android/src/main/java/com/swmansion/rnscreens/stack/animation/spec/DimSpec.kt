package com.swmansion.rnscreens.stack.animation.spec

import com.swmansion.rnscreens.stack.animation.model.Easing

/**
 * A scrim over the slot's screen, alpha animated from [from] to [to].
 */
internal data class DimSpec(
    val color: Int,
    val from: Float,
    val to: Float,
    override val startMs: Long,
    override val durationMs: Long,
    val easing: Easing,
) : TimedSpan
