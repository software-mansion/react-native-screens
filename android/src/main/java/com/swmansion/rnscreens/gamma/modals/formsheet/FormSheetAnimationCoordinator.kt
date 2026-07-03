package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.view.View
import androidx.core.view.doOnPreDraw
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetAnimationCoordinator(
    private val dimmingManager: DimmingViewManager,
) {
    // TODO: @t0maboro - consider exposing as a prop
    val animationDuration = 250L

    private var currentAnimatorSet: AnimatorSet? = null

    internal fun prepareViewForAnimation(view: View) {
        view.doOnPreDraw {
            it.translationY = it.height.toFloat()
        }
    }

    internal fun runEnterAnimation(view: View) {
        val isAnimating = currentAnimatorSet?.isRunning == true

        currentAnimatorSet?.cancel()

        val startY = if (isAnimating) view.translationY else view.height.toFloat()
        val startAlpha = if (isAnimating) dimmingManager.dimmingViewAlpha else 0f

        view.translationY = startY

        val slideAnimator =
            ValueAnimator.ofFloat(startY, 0f).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(startAlpha, dimmingManager.maxAlpha).apply {
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

        val isAnimating = currentAnimatorSet?.isRunning == true
        currentAnimatorSet?.cancel()

        val startY = if (isAnimating) view.translationY else 0f
        val startAlpha = if (isAnimating) dimmingManager.dimmingViewAlpha else dimmingManager.maxAlpha

        val slideAnimator =
            ValueAnimator.ofFloat(startY, view.height.toFloat()).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(startAlpha, 0f).apply {
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
