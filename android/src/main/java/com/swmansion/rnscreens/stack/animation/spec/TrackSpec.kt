package com.swmansion.rnscreens.stack.animation.spec

import android.view.animation.Interpolator
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

internal data class TrackSpec(
    val property: TrackProperty,
    val from: Value,
    val to: Value,
    val startMs: Long,
    val durationMs: Long,
    val interpolator: Interpolator,
)
