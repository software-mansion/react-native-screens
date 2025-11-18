package com.swmansion.rnscreens.bottomsheet

import android.os.Build
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment

class BottomSheetTransitionCoordinator {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

    private var lastInsets: WindowInsets? = null
    private var lastInsetsCompat: WindowInsetsCompat? = null

    fun attachInsetsAndLayoutListenersToBottomSheet(
        screenStackFragment: ScreenStackFragment,
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ) {
        screen.container?.apply {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                setOnApplyWindowInsetsListener { view, insets ->
                    onScreenContainerInsetsApplied(
                        insets,
                        screen,
                        sheetDelegate,
                        coordinatorLayout,
                    )
                }
            } else {
                val bottomSheetWindowInsetListenerChain = screenStackFragment.requireBottomSheetWindowInsetsListenerChain()
                bottomSheetWindowInsetListenerChain.addListener { _, windowInsets ->
                    onScreenContainerInsetsAppliedLegacy(
                        windowInsets,
                        screen,
                        sheetDelegate,
                        coordinatorLayout,
                    )
                }
            }

            addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
                onScreenContainerLayoutChanged(screen)
            }
        }
    }

    private fun onScreenContainerLayoutChanged(screen: Screen) {
        isLayoutComplete = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun onScreenContainerInsetsApplied(
        insets: WindowInsets,
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ): WindowInsets {
        if (lastInsets == insets) {
            return insets
        }
        lastInsets = insets

        val bottomInset = insets.getInsets(WindowInsets.Type.systemBars()).bottom
        handleInsetsApplication(
            bottomInset,
            screen,
            sheetDelegate,
            coordinatorLayout,
        )

        return insets
    }

    private fun onScreenContainerInsetsAppliedLegacy(
        insetsCompat: WindowInsetsCompat,
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ): WindowInsetsCompat {
        if (lastInsetsCompat == insetsCompat) {
            return insetsCompat
        }
        lastInsetsCompat = insetsCompat

        val bottomInset = insetsCompat.getInsets(WindowInsetsCompat.Type.systemBars()).bottom
        handleInsetsApplication(
            bottomInset,
            screen,
            sheetDelegate,
            coordinatorLayout,
        )

        return insetsCompat
    }

    private fun handleInsetsApplication(
        bottomInset: Int,
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ) {
        // Reconfigure BottomSheetBehavior with the same state and updated maxHeight.
        // When insets are available, we can factor them in to update the maximum height accordingly.

        // TODO(@t0maboro) there's some content flicker here while dismissing the keyboard with swipe gesture
        // 1. maybe we should just update maxHeight/expandedOffsetFromTop values, as the no. of detents shouldn't change here
        // 2. maybe we shouldn't do anything on exiting transition
        sheetDelegate.configureBottomSheetBehaviour(screen.sheetBehavior!!, sheetDelegate.keyboardState)

        screen.container?.let { container ->
            // Needs to be highlighted that nothing changes at the container level.
            // However, calling additional measure will trigger BottomSheetBehavior's `onMeasureChild` logic.
            // This method ensures that the bottom sheet respects the maxHeight we update in `configureBottomSheetBehavior`.
            coordinatorLayout.forceLayout()
            coordinatorLayout.measure(
                View.MeasureSpec.makeMeasureSpec(container.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(container.height, View.MeasureSpec.EXACTLY),
            )
            coordinatorLayout.layout(0, 0, container.width, container.height)
        }

        // TODO(@t0maboro)
        // 1. padding doesn't work well with fitToContents
        // 2. verify on paper
        // screen.setPadding(0, 0, 0, bottomInset)

        // Although the layout of the screen container and CoordinatorLayout hasn't changed,
        // the BottomSheetBehavior has updated the maximum height.
        // We manually trigger the callback to notify that the bottom sheet layout has been applied.
        screen.onBottomSheetBehaviorDidLayout(true)

        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    private fun triggerSheetEnterTransitionIfReady(screen: Screen) {
        if (!isLayoutComplete || !areInsetsApplied) return

        screen.requestTriggeringPostponedEnterTransition()
        screen.triggerPostponedEnterTransitionIfNeeded()
    }
}
