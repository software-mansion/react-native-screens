package com.swmansion.rnscreens.bottomsheet

import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import androidx.core.view.WindowInsetsCompat
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.Screen

class BottomSheetTransitionCoordinator {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

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
        // TODO(@t0maboro):
        //  1. Without this line, FormSheet with TextInput is reconfiguring bottom sheet with state.collapsed for some reason
        //  2. TextInput with medium/large detent is causing some reconfiguration and flicker on dismissing with swipe with keyboard open
        //  3. We should check here whether insets has changed
        if (areInsetsApplied) return insets

        val prevInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars())

        // Reconfigure BottomSheetBehavior with the same state and updated maxHeight.
        // When insets are available, we can factor them in to update the maximum height accordingly.
        sheetDelegate.configureBottomSheetBehaviour(screen.sheetBehavior!!)

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

        // TODO(@t0maboro):
        // 1. Without this call, ScreenContentWrapper size doesn't adapt to screen size
        // 2. Fix this for Paper
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            screen.dispatchShadowStateUpdate(
                screen.width,
                screen.height,
                prevInsets.top,
            )
        }

        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady(screen)

        // TODO(@t0maboro):
        // 1. SheetDelegate has onApplyWindowInsets method - we should ensure that both are coordinated well
        return WindowInsets
            .Builder(insets)
            .setInsets(
                WindowInsetsCompat.Type.systemBars(),
                android.graphics.Insets.of(prevInsets.left, 0, prevInsets.right, prevInsets.bottom),
            ).build()
    }

    private fun triggerSheetEnterTransitionIfReady(screen: Screen) {
        if (!isLayoutComplete || !areInsetsApplied) return

        screen.requestTriggeringPostponedEnterTransition()
        screen.triggerPostponedEnterTransitionIfNeeded()
    }
}
