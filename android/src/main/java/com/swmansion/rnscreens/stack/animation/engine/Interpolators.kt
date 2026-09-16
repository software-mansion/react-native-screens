package com.swmansion.rnscreens.stack.animation.engine

import android.annotation.SuppressLint
import android.content.Context
import android.view.animation.AnimationUtils
import android.view.animation.Interpolator
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.spec.TimedSpan
import com.google.android.material.R as MaterialR

/**
 * Curves are loaded from the platform's and Material Components' interpolator resources, never
 * built from transcribed constants.
 */
internal fun Easing.toInterpolator(context: Context): Interpolator =
    when (this) {
        is Easing.Named -> AnimationUtils.loadInterpolator(context, name.resourceId)
    }

internal fun TimedSpan.progressAt(
    timeMs: Float,
    interpolator: Interpolator,
    eased: Boolean,
): Float {
    val fraction = fractionAt(timeMs)
    return if (eased) interpolator.getInterpolation(fraction) else fraction
}

private val EasingName.resourceId: Int
    @SuppressLint("PrivateResource")
    get() =
        when (this) {
            EasingName.LINEAR -> android.R.interpolator.linear
            EasingName.ACCELERATE_DECELERATE -> android.R.interpolator.accelerate_decelerate
            EasingName.ACCELERATE_QUINT -> android.R.interpolator.accelerate_quint
            EasingName.DECELERATE_QUINT -> android.R.interpolator.decelerate_quint
            // Identical to AOSP `fast_out_extra_slow_in`, which is public only from API 28.
            EasingName.EMPHASIZED -> MaterialR.interpolator.m3_sys_motion_easing_emphasized
        }
