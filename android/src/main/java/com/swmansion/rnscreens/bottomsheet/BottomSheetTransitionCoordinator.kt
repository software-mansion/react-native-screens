package com.swmansion.rnscreens.bottomsheet

import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import com.swmansion.rnscreens.Screen

class BottomSheetTransitionCoordinator(
    private val screen: Screen,
    private val sheetDelegate: SheetDelegate,
    private val coordinatorLayout: ViewGroup,
) {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

    init {
        screen.container?.apply {
            // TODO(@t0maboro):
            // 1. It requires API level 30 - we need to add support for lower API levels
            setOnApplyWindowInsetsListener(::onScreenContainerInsetsApplied)
            addOnLayoutChangeListener(::onScreenContainerLayoutChanged)
        }
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun onScreenContainerInsetsApplied(
        view: View,
        insets: WindowInsets,
    ): WindowInsets {
        // TODO(@t0maboro):
        //  1. Without this line, FormSheet with TextInput is reconfiguring bottom sheet with state.collapsed for some reason
        //  2. TextInput with medium/large detent is causing some reconfiguration and flicker on dismissing with swipe with keyboard open
        //  3. We should check here whether insets has changed
        if (areInsetsApplied) return insets

        val prevInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars())

        // TODO(@t0maboro):
        // 1. Reconfiguration is crucial, because we're updating the maximum height for the screen with the system bars insets
        sheetDelegate.configureBottomSheetBehaviour(screen.sheetBehavior!!)

        // TODO(@t0maboro):
        // 1. We need to copy these calls from ScreenStackFragment
        // 2. forceLayout is crucial for repeating the same logic for measure as in ScreenStackFragment
        screen.container?.let { container ->
            coordinatorLayout.forceLayout()
            coordinatorLayout.measure(
                View.MeasureSpec.makeMeasureSpec(container.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(container.height, View.MeasureSpec.EXACTLY),
            )
            coordinatorLayout.layout(0, 0, container.width, container.height)
        }

        // TODO(@t0maboro):
        // 1. Without this call, ScreenContentWrapper size doesn't adapt to screen size
        // 2. Figure out the proper value for `prevInset.top`
        screen.dispatchShadowStateUpdate(
            screen.width,
            screen.height,
            prevInsets.top,
        )

        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady()

        // TODO(@t0maboro):
        // 1. SheetDelegate has onApplyWindowInsets method - we should ensure that both are coordinated well
        return WindowInsets
            .Builder(insets)
            .setInsets(
                WindowInsetsCompat.Type.systemBars(),
                android.graphics.Insets.of(prevInsets.left, 0, prevInsets.right, prevInsets.bottom),
            ).build()
    }

    private fun onScreenContainerLayoutChanged(
        view: View,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        oldLeft: Int,
        oldTop: Int,
        oldRight: Int,
        oldBottom: Int,
    ) {
        isLayoutComplete = true
        triggerSheetEnterTransitionIfReady()
    }

    private fun triggerSheetEnterTransitionIfReady() {
        if (!isLayoutComplete || !areInsetsApplied) return

        // TODO(@t0maboro):
        // 1. Calling some field that I don't want to use directly outside Screen class
        screen.shouldTriggerPostponedTransitionAfterLayout = true
        screen.triggerPostponedEnterTransitionIfNeeded()
    }
}
