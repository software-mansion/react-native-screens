package com.swmansion.rnscreens.sharedElementTransition

import android.view.animation.Animation
import android.view.animation.Transformation
import androidx.fragment.app.Fragment
import com.swmansion.common.ScreenStackFragmentCommon

class ScreensAnimation(private val mFragment: ScreenStackFragmentCommon) : Animation() {
    override fun applyTransformation(interpolatedTime: Float, t: Transformation) {
        super.applyTransformation(interpolatedTime, t)
        // interpolated time should be the progress of the current transition
        mFragment.dispatchTransitionProgress(interpolatedTime, !(mFragment as Fragment).isResumed)
    }
}
