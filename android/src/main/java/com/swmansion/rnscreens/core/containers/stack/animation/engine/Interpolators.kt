package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.annotation.SuppressLint
import android.content.Context
import android.view.animation.AnimationUtils
import android.view.animation.Interpolator
import androidx.core.view.animation.PathInterpolatorCompat
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.google.android.material.R as MaterialR

/**
 * Curves are loaded from the platform's and Material Components' interpolator resources or
 * built from the CSS specification's bezier constants, never transcribed by hand, and cached:
 * one instance per curve serves every animator. Resource interpolators do not depend on the
 * theme, so the cache is keyed by the curve alone.
 */
internal object Interpolators {
    // CSS Easing Functions Level 1, the `ease-in` / `ease-out` / `ease-in-out` keywords.
    private val CSS_EASE_IN = Easing.Bezier(0.42f, 0f, 1f, 1f)
    private val CSS_EASE_OUT = Easing.Bezier(0f, 0f, 0.58f, 1f)
    private val CSS_EASE_IN_OUT = Easing.Bezier(0.42f, 0f, 0.58f, 1f)

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
            is Easing.Bezier -> PathInterpolatorCompat.create(easing.x1, easing.y1, easing.x2, easing.y2)
            is Easing.Named ->
                when (easing.name) {
                    EasingName.EASE_IN -> of(CSS_EASE_IN, context)
                    EasingName.EASE_OUT -> of(CSS_EASE_OUT, context)
                    EasingName.EASE_IN_OUT -> of(CSS_EASE_IN_OUT, context)
                    else -> AnimationUtils.loadInterpolator(context, easing.name.resourceId)
                }
        }

    private val EasingName.resourceId: Int
        @SuppressLint("PrivateResource")
        get() =
            when (this) {
                EasingName.LINEAR -> android.R.interpolator.linear
                EasingName.STANDARD -> MaterialR.interpolator.m3_sys_motion_easing_standard
                EasingName.STANDARD_ACCELERATE -> MaterialR.interpolator.m3_sys_motion_easing_standard_accelerate
                EasingName.STANDARD_DECELERATE -> MaterialR.interpolator.m3_sys_motion_easing_standard_decelerate
                // Identical to AOSP `fast_out_extra_slow_in`, which is public only from API 28.
                EasingName.EMPHASIZED -> MaterialR.interpolator.m3_sys_motion_easing_emphasized
                EasingName.EMPHASIZED_ACCELERATE -> MaterialR.interpolator.m3_sys_motion_easing_emphasized_accelerate
                EasingName.EMPHASIZED_DECELERATE -> MaterialR.interpolator.m3_sys_motion_easing_emphasized_decelerate
                EasingName.ACCELERATE_DECELERATE -> android.R.interpolator.accelerate_decelerate
                EasingName.ACCELERATE_QUINT -> android.R.interpolator.accelerate_quint
                EasingName.DECELERATE_QUINT -> android.R.interpolator.decelerate_quint
                EasingName.EASE_IN, EasingName.EASE_OUT, EasingName.EASE_IN_OUT ->
                    error("[RNScreens] CSS curves are built from constants, not loaded.")
            }
}
