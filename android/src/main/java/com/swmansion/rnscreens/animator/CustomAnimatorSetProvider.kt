package com.swmansion.rnscreens.animator

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Context
import android.view.animation.AnimationUtils
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ext.parentAsView

class CustomAnimatorSetProvider {
    companion object {
        fun customize(
            context: Context?,
            animator: Int,
            initialAnimatorSet: AnimatorSet,
            screen: Screen,
        ): AnimatorSet {
            val finalAnimatorSet = AnimatorSet()
            val screenParent = screen.parentAsView()

            // does this generalize well? parent has 0 width :(
            val screenWidth = screen.measuredWidth

            when (animator) {
                R.animator.rns_default_enter_in -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.1f * screenWidth, 0.0f)
                            .apply {
                                duration = 450
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.fast_out_extra_slow_in)
                            },
                    )
                }
                R.animator.rns_default_enter_out -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -0.1f * screenWidth)
                            .apply {
                                duration = 450
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.fast_out_extra_slow_in)
                            },
                    )
                }
                R.animator.rns_default_exit_in -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -0.1f * screenWidth, 0.0f)
                            .apply {
                                duration = 450
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.fast_out_extra_slow_in)
                            },
                    )
                }
                R.animator.rns_default_exit_out -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, 0.1f * screenWidth)
                            .apply {
                                duration = 450
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.fast_out_extra_slow_in)
                            },
                    )
                }
            }
            return finalAnimatorSet
        }
    }
}
