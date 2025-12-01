package com.swmansion.rnscreens.utils

import android.os.Build
import android.view.View
import android.view.WindowInsets
import androidx.annotation.RequiresApi

object DecorViewInsetsUtils {

    /**
     * Retrieves the top system inset (such as status bar or display cutout) from the given decor view.
     *
     * @param decorView The top-level window decor view.
     * @return The top inset in pixels.
     */
    internal fun getDecorViewTopInset(decorView: View): Int {
        val insets = decorView.rootWindowInsets ?: return 0

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getTopInsetModern(insets)
        } else {
            @Suppress("DEPRECATION")
            insets.systemWindowInsetTop
        }
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun getTopInsetModern(insets: WindowInsets): Int {
        val systemBarsTop = insets.getInsets(WindowInsets.Type.systemBars()).top
        val cutoutTop = insets.displayCutout?.safeInsetTop ?: 0
        return maxOf(systemBarsTop, cutoutTop)
    }
}