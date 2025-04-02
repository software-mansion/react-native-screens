package com.swmansion.rnscreens.stack.anim

import android.view.animation.Animation
import android.view.animation.Transformation
import com.swmansion.rnscreens.ScreenFragment

internal class ScreensAnimation(
    private val mFragment: ScreenFragment,
) : Animation() {
    override fun applyTransformation(
        interpolatedTime: Float,
        t: Transformation,
    ) {
        super.applyTransformation(interpolatedTime, t)
        // interpolated time should be the progress of the current transition
        mFragment.dispatchTransitionProgressEvent(interpolatedTime, !mFragment.isResumed)
    }
}
