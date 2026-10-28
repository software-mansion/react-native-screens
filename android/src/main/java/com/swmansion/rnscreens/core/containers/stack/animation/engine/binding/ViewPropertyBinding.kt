package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

import android.view.View
import android.view.animation.Interpolator
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Timing

internal enum class ViewTarget {
    TRANSLATION_X,
    TRANSLATION_Y,
    ALPHA,
    SCALE,
}

internal class ViewPropertyBinding(
    private val view: View,
    private val target: ViewTarget,
    private val from: Float,
    private val to: Float,
    private val timing: Timing,
    private val interpolator: Interpolator,
) : TrackBinding {
    override fun apply(
        timeMs: Float,
        eased: Boolean,
    ) {
        val progress = timing.progressAt(timeMs)
        set(from + (to - from) * if (eased) interpolator.getInterpolation(progress) else progress)
    }

    override fun restore() = set(target.restValue)

    private fun set(value: Float) {
        when (target) {
            ViewTarget.TRANSLATION_X -> view.translationX = value
            ViewTarget.TRANSLATION_Y -> view.translationY = value
            ViewTarget.ALPHA -> view.alpha = value
            ViewTarget.SCALE -> {
                view.scaleX = value
                view.scaleY = value
            }
        }
    }

    // The `View` defaults.
    private val ViewTarget.restValue: Float
        get() =
            when (this) {
                ViewTarget.TRANSLATION_X, ViewTarget.TRANSLATION_Y -> 0f
                ViewTarget.ALPHA, ViewTarget.SCALE -> 1f
            }
}
