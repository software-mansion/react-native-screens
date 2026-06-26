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
    private val onDismissEnd: () -> Unit,
) {
    // TODO: @t0maboro - consider exposing as a prop
    val animationDuration = 250L

    internal fun runEnterAnimation(view: View) {
        view.translationY = view.height.toFloat()

        val slideAnimator =
            ValueAnimator.ofFloat(view.translationY, 0f).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(0f, dimmingManager.maxAlpha).apply {
                addUpdateListener { animation ->
                    dimmingManager.updateAlpha(animation.animatedValue as Float)
                }
            }

        AnimatorSet().apply {
            playTogether(slideAnimator, alphaAnimator)
            duration = animationDuration
            start()
        }
    }

    internal fun runExitAnimation(view: View?) {
        if (view == null) {
            onDismissEnd()
            return
        }

        val behavior = BottomSheetBehavior.from(view)
        if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
            onDismissEnd()
            return
        }

        view.animate().cancel()

        val slideAnimator =
            ValueAnimator.ofFloat(view.translationY, view.height.toFloat()).apply {
                addUpdateListener { animation ->
                    view.translationY = animation.animatedValue as Float
                }
            }

        val alphaAnimator =
            ValueAnimator.ofFloat(dimmingManager.currentAlpha, 0f).apply {
                addUpdateListener { animation ->
                    dimmingManager.updateAlpha(animation.animatedValue as Float)
                }
            }

        AnimatorSet().apply {
            playTogether(slideAnimator, alphaAnimator)
            duration = animationDuration
            addListener(
                object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) {
                        onDismissEnd()
                    }
                },
            )
            start()
        }
    }
}
