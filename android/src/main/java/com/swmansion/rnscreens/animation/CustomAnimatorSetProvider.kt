package com.swmansion.rnscreens.animation

import android.animation.Animator
import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Context
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AnimationUtils
import android.view.animation.LinearInterpolator
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ext.parentAsView

class CustomAnimatorSetProvider {
    companion object {
        fun getAnimatorFromAnimationResource(
            animationResource: Int,
            context: Context?,
            screen: Screen,
        ): Animator {
            val animatorSet = AnimatorSet()

            val screenParent = screen.parentAsView()

            // TODO(animations): verify that these values can be used to get width/height
            val screenWidth = screen.measuredWidth

            // TODO(animations): first value available when entering, second when exiting; last fallback
            //                   is off by header's height
            val screenHeight = screen.container?.height ?: screenParent?.height ?: screen.measuredHeight

            // TODO(animations): fix styling, move comments from anim/animator files (?), add comment about
            //                   edit being required in 2 places, optimize by removing unnecessary animations (?)
            // TODO(animations): check if correct events are dispatched

            val useV33Animations = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU

            when (animationResource) {
                R.anim.rns_default_enter_in -> {
                    if (useV33Animations) {
                        animatorSet.playTogether(
                            ObjectAnimator
                                .ofFloat(screenParent, "alpha", 0.0f, 0.0f)
                                .apply {
                                    duration = 50
                                    interpolator = LinearInterpolator()
                                },
                            ObjectAnimator
                                .ofFloat(screenParent, "translationX", 0.1f * screenWidth, 0.0f)
                                .apply {
                                    duration = 450
                                    interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.fast_out_extra_slow_in)
                                },
                            ObjectAnimator
                                .ofFloat(screenParent, "alpha", 0.0f, 1.0f)
                                .apply {
                                    duration = 83
                                    startDelay = 50
                                    interpolator = LinearInterpolator()
                                },
                        )
                    } else {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 0.0f).apply {
                                duration = 100
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleX", 0.85f, 1.00f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleY", 0.85f, 1.00f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 1.0f).apply {
                                duration = 100
                                startDelay = 100
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                        )
                    }
                }

                R.anim.rns_default_enter_out -> {
                    if (useV33Animations) {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                                duration = 450
                                interpolator =
                                    AnimationUtils.loadInterpolator(
                                        context,
                                        R.anim.rns_standard_accelerate_interpolator,
                                    )
                            },
                            ObjectAnimator
                                .ofFloat(
                                    screenParent,
                                    "translationX",
                                    0.0f,
                                    -0.1f * screenWidth,
                                ).apply {
                                    duration = 450
                                    interpolator =
                                        AnimationUtils.loadInterpolator(
                                            context,
                                            android.R.interpolator.fast_out_extra_slow_in,
                                        )
                                },
                        )
                    } else {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                                duration = 100
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleX", 1.0f, 1.15f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleY", 1.0f, 1.15f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 0.4f).apply {
                                duration = 100
                                startDelay = 100
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                        )
                    }
                }

                R.anim.rns_default_exit_in -> {
                    if (useV33Animations) {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                                duration = 450
                                interpolator = LinearInterpolator()
                            },
                            ObjectAnimator
                                .ofFloat(
                                    screenParent,
                                    "translationX",
                                    -0.1f * screenWidth,
                                    0.0f,
                                ).apply {
                                    duration = 450
                                    interpolator =
                                        AnimationUtils.loadInterpolator(
                                            context,
                                            android.R.interpolator.fast_out_extra_slow_in,
                                        )
                                },
                        )
                    } else {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 0.0f).apply {
                                duration = 50
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleX", 1.15f, 1.0f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleY", 1.15f, 1.0f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 1.0f).apply {
                                duration = 100
                                startDelay = 50
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                        )
                    }
                }

                R.anim.rns_default_exit_out -> {
                    if (useV33Animations) {
                        animatorSet.playTogether(
                            ObjectAnimator
                                .ofFloat(
                                    screenParent,
                                    "translationX",
                                    0.0f,
                                    0.1f * screenWidth,
                                ).apply {
                                    duration = 450
                                    interpolator =
                                        AnimationUtils.loadInterpolator(
                                            context,
                                            android.R.interpolator.fast_out_extra_slow_in,
                                        )
                                },
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 0.0f).apply {
                                duration = 83
                                startDelay = 35
                                interpolator = LinearInterpolator()
                            },
                        )
                    } else {
                        animatorSet.playTogether(
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                                duration = 50
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleX", 1.0f, 0.85f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "scaleY", 1.0f, 0.85f).apply {
                                duration = 200
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                            ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 0.0f).apply {
                                duration = 100
                                startDelay = 50
                                interpolator = AccelerateDecelerateInterpolator()
                            },
                        )
                    }
                }

                R.anim.rns_slide_out_to_left -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -screenWidth.toFloat())
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_slide_in_from_left -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_slide_out_to_right -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, screenWidth.toFloat())
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_slide_in_from_right -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_slide_out_to_bottom -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", 0.0f, screenHeight.toFloat())
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_slide_in_from_bottom -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationY", screenHeight.toFloat(), 0.0f)
                            .apply {
                                duration = 400
                            },
                    )
                }

                R.anim.rns_fade_from_bottom ->
                    animatorSet.playTogether(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 1.0f).apply {
                            duration = 210
                            interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.decelerate_quint)
                        },
                        ObjectAnimator.ofFloat(screenParent, "translationY", 0.08f * screenHeight, 0.0f).apply {
                            duration = 350
                            interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.decelerate_quint)
                        },
                    )

                R.anim.rns_fade_to_bottom ->
                    animatorSet.playTogether(
                        ObjectAnimator.ofFloat(screenParent, "translationY", 0.0f, 0.08f * screenHeight).apply {
                            duration = 250
                            interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_quint)
                        },
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 0.0f).apply {
                            duration = 150
                            startDelay = 100
                            interpolator = LinearInterpolator()
                        },
                    )

                R.anim.rns_ios_from_left_background_close -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.3f * screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.anim.rns_ios_from_left_background_open -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, 0.3f * screenWidth.toFloat())
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.anim.rns_ios_from_left_foreground_close -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -screenWidth.toFloat())
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.anim.rns_ios_from_left_foreground_open -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.anim.rns_ios_from_right_background_close -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", -0.3f * screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.anim.rns_ios_from_right_background_open -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, -0.3f * screenWidth.toFloat())
                            .apply {
                                duration = 200
                            },
                    )
                }
                R.anim.rns_ios_from_right_foreground_close -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", 0.0f, screenWidth.toFloat())
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.anim.rns_ios_from_right_foreground_open -> {
                    animatorSet.play(
                        ObjectAnimator
                            .ofFloat(screenParent, "translationX", screenWidth.toFloat(), 0.0f)
                            .apply {
                                duration = 200
                                interpolator = AnimationUtils.loadInterpolator(context, android.R.interpolator.accelerate_decelerate)
                            },
                    )
                }
                R.anim.rns_no_animation_20 ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                            duration = 20
                        },
                    )
                R.anim.rns_fade_out ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 0.0f).apply {
                            duration = 150
                        },
                    )
                R.anim.rns_fade_in ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 0.0f, 1.0f).apply {
                            duration = 150
                        },
                    )
                R.anim.rns_no_animation_medium ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                            duration = 400
                        },
                    )
                R.anim.rns_no_animation_250 ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                            duration = 250
                        },
                    )
                R.anim.rns_no_animation_350 ->
                    animatorSet.play(
                        ObjectAnimator.ofFloat(screenParent, "alpha", 1.0f, 1.0f).apply {
                            duration = 350
                        },
                    )
            }

            return animatorSet
        }
    }
}
