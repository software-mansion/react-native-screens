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
                R.animator.rns_slide_out_to_left -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -screenWidth.toFloat())
                            .apply {
                                duration = 400
                            }
                    )
                }
                R.animator.rns_slide_in_from_left -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            }
                    )
                }
                R.animator.rns_slide_out_to_right -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, screenWidth.toFloat())
                            .apply {
                                duration = 400
                            }
                    )
                }
                R.animator.rns_slide_in_from_right -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            }
                    )
                }
                R.animator.rns_no_animation_20,
                R.animator.rns_fade_out,
                R.animator.rns_fade_in -> {
                    finalAnimatorSet.play(initialAnimatorSet)
                }
            }
            return finalAnimatorSet
        }
    }
}
