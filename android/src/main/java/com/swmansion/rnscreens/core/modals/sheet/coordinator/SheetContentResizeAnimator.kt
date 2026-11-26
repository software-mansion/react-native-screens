package com.swmansion.rnscreens.core.modals.sheet.coordinator

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

/**
 * Animates the height changes of a `fitToContents` sheet that follow its content.
 *
 * The sheet's layout has either the old or the new height and the animation only translates it:
 * - a growing sheet gets the new height right away, starts translated down by the height difference, so that it
 *   stays drawn where it was, and slides up to its resting position,
 * - a shrinking sheet keeps the old height, slides down by the height difference and gets the new height only
 *   after the part that is no longer needed has left the window. Laying it out first would leave a gap below
 *   the sheet for the time of the animation.
 */
internal class SheetContentResizeAnimator(
    private val bottomSheetView: FrameLayout,
) {
    internal var isAnimationEnabled: Boolean = true

    internal var isSheetPresented: Boolean = false
        set(value) {
            field = value
            if (!value) {
                cancelAnimations()
            }
        }

    private var isKeyboardAnimationInProgress = false

    private var growTranslationAnimator: ValueAnimator? = null
    private var shrinkTranslationAnimator: ValueAnimator? = null

    // A `fitToContents` sheet rests only in the expanded state. In any other one it is dragged, settling or hidden,
    // and the translations below do not apply.
    private val isSheetExpanded: Boolean
        get() = BottomSheetBehavior.from(bottomSheetView).state == BottomSheetBehavior.STATE_EXPANDED

    /**
     * Changes the height of the sheet by [sheetHeightChange]. [applyNewSheetHeight] gives the sheet its new height.
     */
    internal fun resizeSheet(
        sheetHeightChange: Int,
        applyNewSheetHeight: () -> Unit,
    ) {
        if (!isAnimationEnabled || !isSheetPresented || isKeyboardAnimationInProgress || !isSheetExpanded) {
            resizeWithoutAnimation(applyNewSheetHeight)
            return
        }

        if (sheetHeightChange > 0) {
            resizeThenTranslate(sheetHeightChange, applyNewSheetHeight)
        } else {
            translateThenResize(-sheetHeightChange, applyNewSheetHeight)
        }
    }

    /**
     * The keyboard animation continues from wherever the sheet is drawn, so a growing sheet is simply handed over.
     */
    internal fun onKeyboardAnimationPrepare() {
        isKeyboardAnimationInProgress = true

        // While a shrink animation is running, the sheet is still laid out with the previous height. It is
        // resized now and stays drawn where that translation ends.
        shrinkTranslationAnimator?.let {
            it.end()
            bottomSheetView.translationY = it.animatedValue as Float
        }

        cancelAnimations()
    }

    internal fun onKeyboardAnimationEnd() {
        isKeyboardAnimationInProgress = false
    }

    internal fun destroy() {
        cancelAnimations()
    }

    private fun resizeWithoutAnimation(applyNewSheetHeight: () -> Unit) {
        growTranslationAnimator?.end()
        shrinkTranslationAnimator?.end()
        applyNewSheetHeight()
    }

    // Growing: the sheet gets the new height first, stays drawn where it was and slides up to its place.
    private fun resizeThenTranslate(
        sheetHeightDifference: Int,
        applyNewSheetHeight: () -> Unit,
    ) {
        cancelAnimations()
        applyNewSheetHeight()
        bottomSheetView.translationY += sheetHeightDifference
        growTranslationAnimator =
            animateTranslationTo(0f) {
                growTranslationAnimator = null
            }
    }

    // Shrinking: the sheet slides down first and gets the new height once the part it loses has left the window.
    private fun translateThenResize(
        sheetHeightDifference: Int,
        applyNewSheetHeight: () -> Unit,
    ) {
        cancelAnimations()
        shrinkTranslationAnimator =
            animateTranslationTo(sheetHeightDifference.toFloat()) {
                shrinkTranslationAnimator = null
                applyNewSheetHeight()
                bottomSheetView.translationY = 0f
            }
    }

    // Starts from wherever the sheet is drawn, so interrupting a running animation is a plain retarget.
    private fun animateTranslationTo(
        targetTranslationY: Float,
        onEnd: () -> Unit,
    ): ValueAnimator? {
        if (bottomSheetView.translationY == targetTranslationY) {
            onEnd()
            return null
        }

        return ValueAnimator.ofFloat(bottomSheetView.translationY, targetTranslationY).apply {
            duration = ANIMATION_DURATION
            addUpdateListener { bottomSheetView.translationY = it.animatedValue as Float }
            addListener(
                object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) = onEnd()
                },
            )
            start()
        }
    }

    private fun cancelAnimations() {
        growTranslationAnimator?.cancelWithoutEnd()
        growTranslationAnimator = null
        shrinkTranslationAnimator?.cancelWithoutEnd()
        shrinkTranslationAnimator = null
    }

    private fun ValueAnimator.cancelWithoutEnd() {
        removeAllListeners()
        cancel()
    }

    companion object {
        // TODO: @t0maboro - the same as the enter / exit animations, see `SheetAnimatorFactory`, consider exposing as a prop.
        private const val ANIMATION_DURATION = 250L
    }
}
