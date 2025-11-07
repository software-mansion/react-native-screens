package com.swmansion.rnscreens.bottomsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.WindowInsetsCompat
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator

class SheetAnimationDelegate(
    private val fragment: ScreenStackFragment,
    private val screen: Screen,
    private val coordinatorLayout: CoordinatorLayout,
    private val sheetDelegate: SheetDelegate,
    private val dimmingDelegate: DimmingViewManager,
) {

    private var isSheetAnimationInProgress: Boolean = false
    private var lastKeyboardBottomOffset: Int = 0

    fun createSheetEnterAnimator(): Animator {
        val animatorSet = AnimatorSet()

        val alphaAnimator = createDimmingViewAlphaAnimator(0f, dimmingDelegate.maxAlpha)
        val slideAnimator = createSheetSlideInAnimator()

        animatorSet
            .play(slideAnimator)
            .takeIf {
                dimmingDelegate.willDimForDetentIndex(screen, screen.sheetInitialDetentIndex)
            }?.with(alphaAnimator)

        attachCommonListeners(animatorSet, isEnter = true)

        return animatorSet
    }

    fun createSheetExitAnimator(): Animator {
        val animatorSet = AnimatorSet()

        val alphaAnimator =
            createDimmingViewAlphaAnimator(dimmingDelegate.dimmingView.alpha, 0f)
        val slideAnimator = createSheetSlideOutAnimator()

        animatorSet.play(alphaAnimator).with(slideAnimator)

        attachCommonListeners(animatorSet, isEnter = false)

        return animatorSet
    }

    private fun createDimmingViewAlphaAnimator(from: Float, to: Float): ValueAnimator =
        ValueAnimator.ofFloat(from, to).apply {
            addUpdateListener { animator ->
                (animator.animatedValue as? Float)?.let {
                    dimmingDelegate.dimmingView.alpha = it
                }
            }
        }

    private fun createSheetSlideInAnimator(): ValueAnimator {
        val startValueCallback = { _: Number? -> screen.height.toFloat() }
        val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })

        return ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
            addUpdateListener { updateSheetTranslationY(it.animatedValue as Float) }
        }
    }

    private fun createSheetSlideOutAnimator(): ValueAnimator {
        val endValue = (coordinatorLayout.bottom - screen.top - screen.translationY)

        return ValueAnimator.ofFloat(0f, endValue).apply {
            addUpdateListener {
                updateSheetTranslationY(it.animatedValue as Float)
            }
        }
    }

    private fun updateSheetTranslationY(baseTranslationY: Float) {
        val keyboardCorrection = lastKeyboardBottomOffset
        val bottomOffset =
            sheetDelegate.computeSheetOffsetYWithIMEPresent(keyboardCorrection)?.toFloat() ?: 0f

        screen.translationY = baseTranslationY - bottomOffset
    }

    internal fun handleKeyboardInsetsProgress(insets: WindowInsetsCompat) {
        lastKeyboardBottomOffset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
        // Prioritize enter/exit animations over direct keyboard inset reactions.
        // We store the latest keyboard offset in `lastKeyboardBottomOffset`
        // so that it can always be respected when applying translations in `updateSheetTranslationY`.
        //
        // This approach allows screen translation to be triggered from two sources, but without messing them together:
        // - During enter/exit animations, while accounting for the keyboard height.
        // - While interacting with a TextInput inside the bottom sheet, to handle keyboard show/hide events.
        if (!isSheetAnimationInProgress) {
            updateSheetTranslationY(0f)
        }
    }

    private fun attachCommonListeners(animatorSet: AnimatorSet, isEnter: Boolean) {
        animatorSet.addListener(
            ScreenAnimationDelegate(
                fragment,
                ScreenEventEmitter(screen),
                if (isEnter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )

        animatorSet.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator) {
                isSheetAnimationInProgress = true
            }

            override fun onAnimationEnd(animation: Animator) {
                isSheetAnimationInProgress = false
            }
        })
    }
}
