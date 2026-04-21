package com.swmansion.rnscreens.bottomsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.ext.asScreenStackFragment
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator

internal class SheetAnimationCoordinator(
    private val screen: Screen,
) {
    private var isSheetAnimationInProgress: Boolean = false

    private var lastKeyboardBottomOffset: Int = 0

    internal fun createSheetEnterAnimator(sheetAnimationContext: SheetDelegate.SheetAnimationContext): Animator {
        val animatorSet = AnimatorSet()

        val dimmingDelegate = sheetAnimationContext.dimmingDelegate
        val screenStackFragment = sheetAnimationContext.fragment

        val alphaAnimator = createDimmingViewAlphaAnimator(0f, dimmingDelegate.maxAlpha, dimmingDelegate)
        val slideAnimator = createSheetSlideInAnimator()

        animatorSet
            .play(slideAnimator)
            .takeIf {
                dimmingDelegate.willDimForDetentIndex(screen, screen.sheetInitialDetentIndex)
            }?.with(alphaAnimator)

        attachCommonListeners(animatorSet, isEnter = true, screenStackFragment)

        return animatorSet
    }

    internal fun createSheetExitAnimator(sheetAnimationContext: SheetDelegate.SheetAnimationContext): Animator {
        val animatorSet = AnimatorSet()

        val coordinatorLayout = sheetAnimationContext.coordinatorLayout
        val dimmingDelegate = sheetAnimationContext.dimmingDelegate
        val screenStackFragment = sheetAnimationContext.fragment

        val alphaAnimator =
            createDimmingViewAlphaAnimator(dimmingDelegate.dimmingView.alpha, 0f, dimmingDelegate)
        val slideAnimator = createSheetSlideOutAnimator(coordinatorLayout)

        animatorSet.play(alphaAnimator).with(slideAnimator)

        attachCommonListeners(animatorSet, isEnter = false, screenStackFragment)

        return animatorSet
    }

    /**
     * This should be used only with sheet in `fitToContents` mode.
     *
     * If an entry/exit animation is already in progress, we silently update the
     * behavior metrics and view layout without starting a competing translationY
     * animation - this is the fix for the race condition between the slide-in
     * ValueAnimator and externally triggered layout pass (e.g. applying padding from SAV insets).
     */
    internal fun updateSheetContentHeightWithAnimation(
        behavior: BottomSheetBehavior<Screen>,
        oldHeight: Int,
        newHeight: Int,
    ) {
        val currentTranslationY = screen.translationY

        /*
         * WHY OVERFLOW MATTERS:
         * BottomSheetBehavior has a physical limit (maxHeight) defined by the parent container.
         * If the new content height exceeds this limit (by its size or keyboard offset), simply
         * animating translationY back to 'currentTranslationY' would attempt to render the sheet
         * larger than the screen.
         *
         * We need to constrain the height within the container's bounds.
         * By including this overflow to our animation, we ensure the sheet stops
         * expanding exactly at the maxHeight, preventing from being pushed
         * off-screen or causing layout synchronization issues with the CoordinatorLayout.
         */
        val clampedOldHeight = screen.resolveClampedHeight(oldHeight, currentTranslationY)
        val clampedNewHeight = screen.resolveClampedHeight(newHeight, currentTranslationY)

        // If isSheetAnimationInProgress is set, the entry/exit animator already owns translationY writes.
        // Silently update behavior metrics and re-layout so the ongoing slide animation
        // lands at the correct final geometry, without firing a competing animation.
        if (isSheetAnimationInProgress) {
            behavior.updateMetrics(clampedNewHeight)
            screen.layout(screen.left, screen.bottom - clampedNewHeight, screen.right, screen.bottom)
            return
        }

        val visibleDelta = (clampedNewHeight - clampedOldHeight).toFloat()
        if (visibleDelta == 0f) return

        val isContentExpanding = visibleDelta > 0

        if (isContentExpanding) {
            /*
             * Expanding content animation:
             *
             * Before animation, we're updating the SheetBehavior - the maximum height is the new
             * content height, then we're forcing a layout pass. This ensures the view calculates
             * with its new bounds when the animation starts.
             *
             * In the animation, we're translating the Screen back to it's (newly calculated) origin
             * position, providing an impression that FormSheet expands. It already has the final size,
             * but some content is not yet visible on the screen.
             *
             * After animation, we just need to send a notification that ShadowTree state should be updated,
             * as the positioning of pressables has changed due to the Y translation manipulation.
             */
            screen.translationY += visibleDelta
            screen
                .animate()
                .translationY(currentTranslationY)
                .withStartAction {
                    behavior.updateMetrics(clampedNewHeight)
                    screen.layout(screen.left, screen.bottom - clampedNewHeight, screen.right, screen.bottom)
                }.withEndAction {
                    // Force a layout pass on the CoordinatorLayout to synchronize BottomSheetBehavior's
                    // internal offsets with the new maxHeight. This prevents the sheet from snapping back
                    // to its old position when the user starts a gesture.
                    screen.parent.requestLayout()
                    screen.onSheetYTranslationChanged()
                }.start()
        } else {
            /*
             * Shrinking content animation:
             *
             * Before the animation, our Screen translationY is 0 - because its actual layout and visual position are equal.
             *
             * Before the animation, I'm updating sheet metrics to the target value - it won't update until the next layout pass,
             * which is controlled by end action. This is done deliberately, to allow catching the case when quick combination
             * of shrink & expand animation is detected.
             *
             * In the animation, we're translating the Screen down by the calculated height delta to the position (which will
             * be new absolute 0 for the Screen, after ending the transition), providing an impression that FormSheet shrinks.
             * FormSheet's size remains unchanged during the whole animation, therefore there is no view clipping.
             *
             * After animation, we can update the layout: the maximum FormSheet height is updated and we're forcing
             * another layout pass. Additionally, since the actual layout and the target position are equal,
             * we can reset translationY to 0.
             *
             * After animation, we need to send a notification that ShadowTree state should be updated,
             * as the FormSheet size has changed and the positioning of pressables has changed due to the Y translation manipulation.
             */
            val targetTranslationY = currentTranslationY - visibleDelta
            screen
                .animate()
                .translationY(targetTranslationY)
                .withStartAction {
                    behavior.updateMetrics(clampedNewHeight)
                }.withEndAction {
                    screen.layout(screen.left, screen.bottom - clampedNewHeight, screen.right, screen.bottom)
                    screen.translationY = currentTranslationY
                    // Force a layout pass on the CoordinatorLayout to synchronize BottomSheetBehavior's
                    // internal offsets with the new maxHeight. This prevents the sheet from snapping back
                    // to its old position when the user starts a gesture.
                    screen.parent.requestLayout()
                    screen.onSheetYTranslationChanged()
                }.start()
        }
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

    // This function calculates the Y offset to which the FormSheet should animate
    // when appearing (entering) or disappearing (exiting) with the on-screen keyboard (IME) present.
    // Its purpose is to ensure the FormSheet does not exceed the top edge of the screen.
    // It tries to display the FormSheet fully above the keyboard when there's enough space.
    // Otherwise, it shifts the sheet as high as possible, even if it means part of its content
    // will remain hidden behind the keyboard.
    private fun computeSheetOffsetYWithIMEPresent(keyboardHeight: Int): Int {
        val containerHeight =
            screen.fragment
                ?.asScreenStackFragment()
                ?.sheetDelegate
                ?.tryResolveMaxFormSheetHeight()
        check(containerHeight != null) {
            "[RNScreens] Failed to find window height during bottom sheet behaviour configuration"
        }

        if (screen.isSheetFitToContents()) {
            val contentHeight = screen.contentWrapper?.height ?: 0
            val offsetFromTop = maxOf(containerHeight - contentHeight, 0)
            // If the content is higher than the Screen, offsetFromTop becomes negative.
            // In such cases, we return 0 because a negative translation would shift the Screen
            // to the bottom, which is not intended.
            return minOf(offsetFromTop, keyboardHeight)
        }

        val detents = screen.sheetDetents

        val detentValue = detents.highest().coerceIn(0.0, 1.0)
        val sheetHeight = (detentValue * containerHeight).toInt()
        val offsetFromTop = containerHeight - sheetHeight

        return minOf(offsetFromTop, keyboardHeight)
    }

    private fun updateSheetTranslationY(baseTranslationY: Float) {
        val keyboardCorrection = lastKeyboardBottomOffset
        val bottomOffset = computeSheetOffsetYWithIMEPresent(keyboardCorrection).toFloat()

        screen.translationY = baseTranslationY - bottomOffset
    }

    private fun createSheetSlideInAnimator(): ValueAnimator {
        val startValueCallback = { _: Number? -> screen.height.toFloat() }
        val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })

        return ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
            addUpdateListener { updateSheetTranslationY(it.animatedValue as Float) }
        }
    }

    private fun createSheetSlideOutAnimator(coordinatorLayout: CoordinatorLayout): ValueAnimator {
        val endValue = (coordinatorLayout.bottom - screen.top - screen.translationY)

        return ValueAnimator.ofFloat(0f, endValue).apply {
            addUpdateListener {
                updateSheetTranslationY(it.animatedValue as Float)
            }
        }
    }

    private fun createDimmingViewAlphaAnimator(
        from: Float,
        to: Float,
        dimmingDelegate: DimmingViewManager,
    ): ValueAnimator =
        ValueAnimator.ofFloat(from, to).apply {
            addUpdateListener { animator ->
                (animator.animatedValue as? Float)?.let {
                    dimmingDelegate.dimmingView.alpha = it
                }
            }
        }

    private fun attachCommonListeners(
        animatorSet: AnimatorSet,
        isEnter: Boolean,
        screenStackFragment: ScreenStackFragment,
    ) {
        animatorSet.addListener(
            ScreenAnimationDelegate(
                screenStackFragment,
                ScreenEventEmitter(screen),
                if (isEnter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )

        animatorSet.addListener(
            object : AnimatorListenerAdapter() {
                override fun onAnimationStart(animation: Animator) {
                    isSheetAnimationInProgress = true
                }

                override fun onAnimationEnd(animation: Animator) {
                    isSheetAnimationInProgress = false

                    screen.onSheetYTranslationChanged()
                }
            },
        )
    }
}
