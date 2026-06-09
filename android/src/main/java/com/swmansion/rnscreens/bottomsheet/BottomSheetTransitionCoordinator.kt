package com.swmansion.rnscreens.bottomsheet

import android.os.Handler
import android.os.Looper
import com.swmansion.rnscreens.Screen

class BottomSheetTransitionCoordinator {
    private var isLayoutComplete = false
    private var areInsetsApplied = false

    private val handler = Handler(Looper.getMainLooper())
    private var insetsFallbackRunnable: Runnable? = null

    internal fun onScreenContainerLayoutChanged(screen: Screen) {
        isLayoutComplete = true
        triggerSheetEnterTransitionIfReady(screen)
        scheduleInsetsFallbackIfNeeded(screen)
    }

    internal fun onScreenContainerInsetsApplied(screen: Screen) {
        cancelInsetsFallback()
        areInsetsApplied = true
        triggerSheetEnterTransitionIfReady(screen)
    }

    internal fun cancel() {
        cancelInsetsFallback()
    }

    private fun triggerSheetEnterTransitionIfReady(screen: Screen) {
        if (!isLayoutComplete || !areInsetsApplied) return

        screen.requestTriggeringPostponedEnterTransition()
        screen.triggerPostponedEnterTransitionIfNeeded()
    }

    //
    // The FormSheet's transition is gated on two signals:
    // - the screen container being laid out
    // - a WindowInsets dispatch reaching the listener attached in
    // ScreenStackFragment#attachInsetsAndLayoutListenersToBottomSheet.
    //
    // In some setups, e.g. in brownfield setups these signals are unreliable because
    // the host Activity has already dispatched its insets and these might not be
    // reached e.g. when some View higher in the hierarchy decided to consume them.
    //
    // As a workaround, we need to accept that the listener may never
    // fire and unblock the transition after some arbitrary time (INSETS_FALLBACK_MS).
    //
    private fun scheduleInsetsFallbackIfNeeded(screen: Screen) {
        if (areInsetsApplied || insetsFallbackRunnable != null) {
            return
        }
        val runnable =
            Runnable {
                insetsFallbackRunnable = null
                areInsetsApplied = true
                triggerSheetEnterTransitionIfReady(screen)
            }

        insetsFallbackRunnable = runnable
        handler.postDelayed(runnable, INSETS_FALLBACK_MS)
    }

    private fun cancelInsetsFallback() {
        insetsFallbackRunnable?.let { handler.removeCallbacks(it) }
        insetsFallbackRunnable = null
    }

    companion object {
        private const val INSETS_FALLBACK_MS = 250L
    }
}
