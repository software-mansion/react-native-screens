package com.swmansion.rnscreens.bottomsheet

import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import com.swmansion.rnscreens.Screen

class BottomSheetTransitionCoordinator {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

    private var lastInsets: WindowInsets? = null

    fun attachInsetsAndLayoutListenersToBottomSheet(
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ) {
        screen.container?.apply {
            setOnApplyWindowInsetsListener { view, insets ->
                onScreenContainerInsetsApplied(view, insets, screen, sheetDelegate, coordinatorLayout)
            }
            addOnLayoutChangeListener { view, l, t, r, b, ol, ot, or, ob ->
                onScreenContainerLayoutChanged(screen)
            }
        }
    }

    private fun onScreenContainerLayoutChanged(screen: Screen) {
        isLayoutComplete = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    private fun onScreenContainerInsetsApplied(
        view: View,
        insets: WindowInsets,
        screen: Screen,
        sheetDelegate: SheetDelegate,
        coordinatorLayout: ViewGroup,
    ): WindowInsets {
        if (lastInsets == insets) {
            return insets
        }
        lastInsets = insets

        // Reconfigure BottomSheetBehavior with the same state and updated maxHeight.
        // When insets are available, we can factor them in to update the maximum height accordingly.
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

        // Although the layout of the screen container and CoordinatorLayout hasn't changed,
        // the BottomSheetBehavior has updated the maximum height.
        // We manually trigger the callback to notify that the bottom sheet layout has been applied.
        screen.onBottomSheetBehaviorDidLayout(true)

        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady(screen)

        // Our goal is to execute the side effect of delaying the animation,
        // therefore we pass the unmodified insets in every case.
        return insets
    }

    private fun triggerSheetEnterTransitionIfReady(screen: Screen) {
        if (!isLayoutComplete || !areInsetsApplied) return

        screen.requestTriggeringPostponedEnterTransition()
        screen.triggerPostponedEnterTransitionIfNeeded()
    }
}
