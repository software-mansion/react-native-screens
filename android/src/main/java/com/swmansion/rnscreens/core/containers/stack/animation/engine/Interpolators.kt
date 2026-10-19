package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.annotation.SuppressLint
import android.content.Context
import android.view.animation.AnimationUtils
import android.view.animation.Interpolator
import androidx.core.view.animation.PathInterpolatorCompat
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import java.util.EnumMap
import com.google.android.material.R as MaterialR

/**
 * Curves are loaded from the platform's and Material Components' interpolator resources or
 * built from the CSS specification's bezier constants, never transcribed by hand.
 *
 * Loading an interpolator inflates it from XML every time (the platform does not cache it), so
 * named curves are cached here. Interpolators are immutable and theme-independent, so one
 * instance per curve serves every animator. A bezier is cheap to build (no resource parsing) and
 * is built on every request, so arbitrary curves never accumulate. Main thread only.
 */
internal object Interpolators {
    // CSS Easing Functions Level 1, the `ease-in` / `ease-out` / `ease-in-out` keywords.
    private val CSS_EASE_IN = Easing.Bezier(0.42f, 0f, 1f, 1f)
    private val CSS_EASE_OUT = Easing.Bezier(0f, 0f, 0.58f, 1f)
    private val CSS_EASE_IN_OUT = Easing.Bezier(0.42f, 0f, 0.58f, 1f)

    private val cache = EnumMap<EasingName, Interpolator>(EasingName::class.java)

    internal fun of(
        easing: Easing,
        context: Context,
    ): Interpolator =
        when (easing) {
            is Easing.Bezier -> easing.toInterpolator()
            is Easing.Named -> cache.getOrPut(easing.name) { load(easing.name, context) }
        }

    @SuppressLint("PrivateResource")
    private fun load(
        name: EasingName,
        context: Context,
    ): Interpolator =
        when (name) {
            EasingName.LINEAR -> context.inflate(android.R.interpolator.linear)
            EasingName.EASE_IN -> CSS_EASE_IN.toInterpolator()
            EasingName.EASE_OUT -> CSS_EASE_OUT.toInterpolator()
            EasingName.EASE_IN_OUT -> CSS_EASE_IN_OUT.toInterpolator()
            EasingName.STANDARD -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_standard)
            EasingName.STANDARD_ACCELERATE -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_standard_accelerate)
            EasingName.STANDARD_DECELERATE -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_standard_decelerate)
            // Identical to AOSP `fast_out_extra_slow_in`, which is public only from API 28.
            EasingName.EMPHASIZED -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_emphasized)
            EasingName.EMPHASIZED_ACCELERATE -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_emphasized_accelerate)
            EasingName.EMPHASIZED_DECELERATE -> context.inflate(MaterialR.interpolator.m3_sys_motion_easing_emphasized_decelerate)
            EasingName.ACCELERATE_DECELERATE -> context.inflate(android.R.interpolator.accelerate_decelerate)
            EasingName.ACCELERATE_QUINT -> context.inflate(android.R.interpolator.accelerate_quint)
            EasingName.DECELERATE_QUINT -> context.inflate(android.R.interpolator.decelerate_quint)
        }

    private fun Context.inflate(id: Int): Interpolator = AnimationUtils.loadInterpolator(this, id)

    private fun Easing.Bezier.toInterpolator(): Interpolator = PathInterpolatorCompat.create(x1, y1, x2, y2)
}
