package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.annotation.SuppressLint
import android.content.Context
import android.view.animation.AnimationUtils
import android.view.animation.Interpolator
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.google.android.material.R as MaterialR

/**
 * Curves are loaded from the platform's and Material Components' interpolator resources, never
 * built from transcribed constants, and cached: one instance per curve serves every animator.
 */
internal object Interpolators {
    private val cache = HashMap<Easing, Interpolator>()

    internal fun of(
        easing: Easing,
        context: Context,
    ): Interpolator = cache.getOrPut(easing) { load(easing, context) }

    private fun load(
        easing: Easing,
        context: Context,
    ): Interpolator =
        when (easing) {
            is Easing.Named -> AnimationUtils.loadInterpolator(context, easing.name.resourceId)
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
}
