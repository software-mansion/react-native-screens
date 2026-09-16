package com.swmansion.rnscreens.stack.animation.spec

import android.view.animation.Interpolator

/**
 * A scrim over the slot's screen, alpha animated from [from] to [to].
 */
internal data class DimSpec(
    val color: Int,
    val from: Float,
    val to: Float,
    val startMs: Long,
    val durationMs: Long,
    val interpolator: Interpolator,
)
