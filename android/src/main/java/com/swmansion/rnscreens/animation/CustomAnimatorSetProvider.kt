package com.swmansion.rnscreens.animation

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

            // TODO: verify that these values can be used to get width/height
            val screenWidth = screen.measuredWidth

            // TODO: first value available when entering, second when exiting; last fallback
            //       is off by header's height
            val screenHeight = screen.container?.height ?: screenParent?.height ?: screen.measuredHeight

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
                            },
                    )
                }
                R.animator.rns_slide_in_from_left -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }
                R.animator.rns_slide_out_to_right -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, screenWidth.toFloat())
                            .apply {
                                duration = 400
                            },
                    )
                }
                R.animator.rns_slide_in_from_right -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }
                R.animator.rns_slide_out_to_bottom -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", 0.0f, screenHeight.toFloat())
                            .apply {
                                duration = 400
                            },
                    )
                }
                R.animator.rns_slide_in_from_bottom -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", screenHeight.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }
                R.animator.rns_fade_from_bottom -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", 0.08f * screenHeight.toFloat(), 0.0f)
                            .apply {
                                duration = 350
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.decelerate_quint)
                            },
                    )
                }
                R.animator.rns_fade_to_bottom -> {
                    finalAnimatorSet.playTogether(
                        initialAnimatorSet,
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", 0.0f, 0.08f * screenHeight.toFloat())
                            .apply {
                                duration = 250
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_quint)
                            },
                    )
                }
                R.animator.rns_ios_from_left_background_close -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.3f * screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.animator.rns_ios_from_left_background_open -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, 0.3f * screenWidth.toFloat())
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.animator.rns_ios_from_left_foreground_close -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -screenWidth.toFloat())
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.animator.rns_ios_from_left_foreground_open -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.animator.rns_ios_from_right_background_close -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -0.3f * screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.animator.rns_ios_from_right_background_open -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -0.3f * screenWidth.toFloat())
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.animator.rns_ios_from_right_foreground_close -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, screenWidth.toFloat())
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.animator.rns_ios_from_right_foreground_open -> {
                    finalAnimatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.animator.rns_no_animation_20,
                R.animator.rns_fade_out,
                R.animator.rns_fade_in,
                R.animator.rns_no_animation_medium,
                R.animator.rns_no_animation_250,
                R.animator.rns_no_animation_350
                -> {
                    finalAnimatorSet.play(initialAnimatorSet)
                }
            }
            return finalAnimatorSet
        }
    }
}
