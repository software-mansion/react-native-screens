package com.swmansion.rnscreens.stack.animation.engine

import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.Interpolator
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
            EasingName.ACCELERATE_DECELERATE -> AccelerateDecelerateInterpolator()
        }
}
