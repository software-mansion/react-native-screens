package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.view.View
import androidx.core.animation.doOnStart
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetAnimatorFactory(
    private val dimmingManager: DimmingViewManager,
) {
    // TODO: @t0maboro - consider exposing as a prop
    val animationDuration = 250L

    internal fun createEnterAnimator(
        view: View,
        isInterrupting: Boolean = false,
    ): Animator {
        val startY = if (isInterrupting) view.translationY else view.height.toFloat()
        val startAlpha = if (isInterrupting) dimmingManager.dimmingViewAlpha else 0f

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

        return AnimatorSet().apply {
            playTogether(slideAnimator, alphaAnimator)
            duration = animationDuration
            doOnStart { view.translationY = startY }
        }
    }

    internal fun createExitAnimator(
        view: View,
        isInterrupting: Boolean = false,
    ): Animator {
        val startY = if (isInterrupting) view.translationY else 0f
        val startAlpha = if (isInterrupting) dimmingManager.dimmingViewAlpha else dimmingManager.maxAlpha

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

        return AnimatorSet().apply {
            playTogether(slideAnimator, alphaAnimator)
            duration = animationDuration
        }
    }
}
