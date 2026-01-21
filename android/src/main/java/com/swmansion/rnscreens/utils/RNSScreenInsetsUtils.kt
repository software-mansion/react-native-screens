package com.swmansion.rnscreens.utils

import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.Screen

/**
 * Utility object to calculate and cache the top window insets (Status Bar or Display Cutout).
 *
 * Screen components may have calculated layout, before the Activity is (re)created and attached
 * to reactContext. This utility provides a "best-effort" estimation by using fallbacks and a memory cache.
 */
object RNSScreenInsetsUtils {
    // We cache the last known inset to prevent jumping content between Screen components transitions.
    private var lastKnownTopInset: Int = 0

    /**
     * Estimates the top inset for a given Screen
     * .
     * Strategy:
     * 1. Check the Activity's DecorView (most accurate place where we can expect insets to be applied before
     *    Screen layout calculation triggered by React).
     * 2. Check the Screen view's own RootWindowInsets (fallback if Activity was recreated and isn't ready).
     * 3. Return the lastKnownTopInset (if anything earlier has failed, we're assuming that insets are rather constant
     *    across Screens).
     */
    internal fun getEstimatedTopInset(
        reactContext: ReactContext,
        screen: Screen?,
    ): Int {
        // 1. Try reading from the Activity's DecorView.
        // This is the most reliable source if the Activity is currently focused and attached.
        val activity = reactContext.currentActivity
        val decorView = activity?.window?.decorView

        if (decorView != null) {
            val inset = getDecorViewTopInset(decorView)
            if (inset > 0) {
                lastKnownTopInset = inset
                return inset
            }
        }

        // 2. Fallback: Try reading from the Screen view itself.
        // Useful during activity recreation where the context might not have the activity
        // reference updated yet, but the view is already part of a layout pass.
        if (screen != null) {
            val windowInsets = ViewCompat.getRootWindowInsets(screen as View)
            val systemInset = windowInsets?.let { getTopInset(it) } ?: 0

            if (systemInset > 0) {
                lastKnownTopInset = systemInset
                return systemInset
            }
        }

        // 3. Fallback: Return the last successfully measured value.
        // On Android, status bar and cutout sizes are usually constant for the device session.
        return lastKnownTopInset
    }

    /**
     * Extracts the top inset for System Bars and Display Cutouts from a DecorView.
     * Returns 0 if insets are unavailable.
     */
    private fun getDecorViewTopInset(decorView: View): Int {
        val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return 0
        return getTopInset(insetsCompat)
    }

    /**
     * Calculates the top inset value specifically for System Bars and Cutouts.
     */
    private fun getTopInset(insetsCompat: WindowInsetsCompat): Int =
        insetsCompat
            .getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
            ).top
}
