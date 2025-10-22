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
        // This is called while android is drawing. The event might be intercepted by reanimated
        // which could trigger a sync mount, which can alter the native view hierarchy, which
        // could lead to a crash, see: https://github.com/software-mansion/react-native-screens/issues/3321
        mFragment.view?.post {
            // interpolated time should be the progress of the current transition
            mFragment.dispatchTransitionProgressEvent(interpolatedTime, !mFragment.isResumed)
        }
    }
}
