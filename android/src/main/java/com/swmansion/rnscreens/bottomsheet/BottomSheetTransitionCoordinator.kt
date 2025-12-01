package com.swmansion.rnscreens.bottomsheet

import com.swmansion.rnscreens.Screen

class BottomSheetTransitionCoordinator {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

    internal fun onScreenContainerLayoutChanged(screen: Screen) {
        isLayoutComplete = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    internal fun onScreenContainerInsetsApplied(screen: Screen) {
        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    private fun triggerSheetEnterTransitionIfReady(screen: Screen) {
        if (!isLayoutComplete || !areInsetsApplied) return

        screen.requestTriggeringPostponedEnterTransition()
        screen.triggerPostponedEnterTransitionIfNeeded()
    }
}
