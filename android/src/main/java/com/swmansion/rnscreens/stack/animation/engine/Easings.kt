package com.swmansion.rnscreens.stack.animation.engine

import android.graphics.Path
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.Interpolator
import android.view.animation.LinearInterpolator
import android.view.animation.PathInterpolator
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import java.util.EnumMap

internal object Easings {
    // Interpolators are stateless, so one instance per easing can be shared by every animator.
    private val cache = EnumMap<EasingName, Interpolator>(EasingName::class.java)

    fun get(easing: Easing): Interpolator =
        when (easing) {
            is Easing.Named -> cache.getOrPut(easing.name) { create(easing.name) }
        }

    private fun create(name: EasingName): Interpolator =
        when (name) {
            EasingName.LINEAR -> LinearInterpolator()
            EasingName.ACCELERATE_DECELERATE -> AccelerateDecelerateInterpolator()
            // AOSP `accelerate_quint` / `decelerate_quint`.
            EasingName.ACCELERATE_QUINT -> AccelerateInterpolator(2.5f)
            EasingName.DECELERATE_QUINT -> DecelerateInterpolator(2.5f)
            EasingName.EMPHASIZED -> PathInterpolator(emphasizedPath())
        }

    // Material 3 `emphasized`, identical to AOSP `fast_out_extra_slow_in`: two cubic segments
    // joined at (1/6 of the time, 40 % of the value).
    private fun emphasizedPath(): Path =
        Path().apply {
            moveTo(0f, 0f)
            cubicTo(0.05f, 0f, 0.133333f, 0.06f, 0.166666f, 0.4f)
            cubicTo(0.208333f, 0.82f, 0.25f, 1f, 1f, 1f)
        }
}
