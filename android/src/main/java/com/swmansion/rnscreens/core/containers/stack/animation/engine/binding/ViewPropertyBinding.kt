package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

import android.view.View
import android.view.animation.Interpolator
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Timing

internal class ViewPropertyBinding(
    private val view: View,
    private val set: View.(Float) -> Unit,
    private val from: Float,
    private val to: Float,
    private val restValue: Float,
    private val timing: Timing,
    private val interpolator: Interpolator,
) : TrackBinding {
    override fun apply(
        timeMs: Float,
        eased: Boolean,
    ) {
        val progress = timing.progressAt(timeMs)
        view.set(from + (to - from) * if (eased) interpolator.getInterpolation(progress) else progress)
    }

    override fun restore() = view.set(restValue)
}
