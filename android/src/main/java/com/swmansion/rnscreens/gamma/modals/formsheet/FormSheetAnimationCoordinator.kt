package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetAnimationCoordinator(
    private val dimmingManager: DimmingViewManager,
) {
    // TODO: @t0maboro - consider exposing as a prop
    val animationDuration = 250L

    private var currentAnimatorSet: AnimatorSet? = null

    internal fun runEnterAnimation(view: View) {
        currentAnimatorSet?.cancel()

        val slideAnimator =
            ValueAnimator.ofFloat(view.translationY, 0f).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(dimmingManager.dimmingViewAlpha, dimmingManager.maxAlpha).apply {
                addUpdateListener { animation ->
                    dimmingManager.dimmingViewAlpha = animation.animatedValue as Float
                }
            }

        currentAnimatorSet =
            AnimatorSet().apply {
                playTogether(slideAnimator, alphaAnimator)
                duration = animationDuration
                addListener(
                    object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            if (currentAnimatorSet == this@apply) currentAnimatorSet = null
                        }
                    },
                )
                start()
            }
    }

    internal fun runExitAnimation(
        view: View?,
        onAnimationEnd: () -> Unit,
    ) {
        if (view == null) {
            onAnimationEnd()
            return
        }

        val behavior = BottomSheetBehavior.from(view)
        if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
            onAnimationEnd()
            return
        }

        currentAnimatorSet?.cancel()

        val slideAnimator =
            ValueAnimator.ofFloat(view.translationY, view.height.toFloat()).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(dimmingManager.dimmingViewAlpha, 0f).apply {
                addUpdateListener { animation ->
                    dimmingManager.dimmingViewAlpha = animation.animatedValue as Float
                }
            }

        currentAnimatorSet =
            AnimatorSet().apply {
                playTogether(slideAnimator, alphaAnimator)
                duration = animationDuration
                addListener(
                    object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            if (currentAnimatorSet == this@apply) currentAnimatorSet = null
                            onAnimationEnd()
                        }
                    },
                )
                start()
            }
    }
}
