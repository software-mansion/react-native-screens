package com.swmansion.rnscreens.bottomsheet

import android.animation.ValueAnimator
import android.view.View
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment

/**
 * Provides bulk of necessary logic for the dimming view accompanying the formSheet.
 */
class DimmingViewManager(
    val reactContext: ThemedReactContext,
    screen: Screen,
) {
    internal val dimmingView: DimmingView = createDimmingView(screen)
    internal val maxAlpha: Float = 0.3f
    private var dimmingViewCallback: BottomSheetCallback? = null

    /**
     * Should be called when hosting fragment has its view hierarchy created.
     */
    fun onViewHierarchyCreated(
        screen: Screen,
        root: ViewGroup,
    ) {
        root.addView(dimmingView, 0)
        if (!willDimForDetentIndex(screen, screen.sheetInitialDetentIndex)) {
            dimmingView.alpha = 0.0f
        } else {
            dimmingView.alpha = maxAlpha
        }
    }

    /**
     * Should be called after screen of hosting fragment has its behaviour attached.
     */
    fun onBehaviourAttached(
        screen: Screen,
        behavior: BottomSheetBehavior<Screen>,
    ) {
        behavior.addBottomSheetCallback(requireBottomSheetCallback(screen, forceCreation = true))
    }

    /**
     * Ask the manager whether it will apply non-zero alpha for sheet at given detent index.
     */
    fun willDimForDetentIndex(
        screen: Screen,
        index: Int,
    ) = index > screen.sheetLargestUndimmedDetentIndex

    fun invalidate(behavior: BottomSheetBehavior<Screen>?) {
        dimmingViewCallback?.let { callback -> behavior?.removeBottomSheetCallback(callback) }
    }

    /**
     * This bottom sheet callback is responsible for animating alpha of the dimming view.
     */
    private class AnimateDimmingViewCallback(
        val screen: Screen,
        val viewToAnimate: View,
        val maxAlpha: Float,
    ) : BottomSheetCallback() {
        // largest *slide offset* that is yet undimmed
        private var largestUndimmedOffset: Float =
            computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)

        // first *slide offset* that should be fully dimmed
        private var firstDimmedOffset: Float =
            computeOffsetFromDetentIndex(
                (screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(
                    0,
                    screen.sheetDetents.count() - 1,
                ),
            )

        // interval that we interpolate the alpha value over
        private var intervalLength = firstDimmedOffset - largestUndimmedOffset
        private val animator =
            ValueAnimator.ofFloat(0F, maxAlpha).apply {
                duration = 1 // Driven manually
                addUpdateListener {
                    viewToAnimate.alpha = it.animatedValue as Float
                }
            }

        override fun onStateChanged(
            bottomSheet: View,
            newState: Int,
        ) {
            if (newState == BottomSheetBehavior.STATE_DRAGGING || newState == BottomSheetBehavior.STATE_SETTLING) {
                largestUndimmedOffset =
                    computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)
                firstDimmedOffset =
                    computeOffsetFromDetentIndex(
                        (screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(
                            0,
                            screen.sheetDetents.count() - 1,
                        ),
                    )
                assert(firstDimmedOffset >= largestUndimmedOffset) {
                    "[RNScreens] Invariant violation: firstDimmedOffset ($firstDimmedOffset) < largestDimmedOffset ($largestUndimmedOffset)"
                }
                intervalLength = firstDimmedOffset - largestUndimmedOffset
            }
        }

        override fun onSlide(
            bottomSheet: View,
            slideOffset: Float,
        ) {
            if (largestUndimmedOffset < slideOffset && slideOffset < firstDimmedOffset) {
                val fraction = (slideOffset - largestUndimmedOffset) / intervalLength
                animator.setCurrentFraction(fraction)
            }
        }

        /**
         * This method does compute slide offset (see [BottomSheetCallback.onSlide] docs) for detent
         * at given index in the detents array.
         */
        private fun computeOffsetFromDetentIndex(index: Int): Float =
            when (screen.sheetDetents.size) {
                1 -> // Only 1 detent present in detents array
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 1F // fully expanded
                        else -> -1F // unexpected, default
                    }

                2 ->
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 0F // collapsed
                        1 -> 1F // expanded
                        else -> -1F
                    }

                3 ->
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 0F // collapsed
                        1 -> screen.sheetBehavior!!.halfExpandedRatio // half
                        2 -> 1F // expanded
                        else -> -1F
                    }

                else -> -1F
            }
    }

    private fun createDimmingView(screen: Screen): DimmingView =
        DimmingView(reactContext, maxAlpha).apply {
            // These do not guarantee fullscreen width & height, TODO: find a way to guarantee that
            layoutParams =
                ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
            setOnClickListener {
                if (screen.sheetClosesOnTouchOutside) {
                    (screen.fragment as ScreenStackFragment).dismissSelf()
                }
            }
        }

    private fun requireBottomSheetCallback(
        screen: Screen,
        forceCreation: Boolean = false,
    ): BottomSheetCallback {
        if (dimmingViewCallback == null || forceCreation) {
            dimmingViewCallback = AnimateDimmingViewCallback(screen, dimmingView, maxAlpha)
        }
        return dimmingViewCallback!!
    }
}
