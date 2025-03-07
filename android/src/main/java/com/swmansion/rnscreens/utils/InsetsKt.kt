package com.swmansion.rnscreens.utils

import android.os.Build
import android.view.View
import android.view.WindowInsets
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat

typealias InsetsCompat = androidx.core.graphics.Insets
typealias InsetsPlatform = android.graphics.Insets // Available since SDK 29

@RequiresApi(Build.VERSION_CODES.Q)
internal fun InsetsPlatform.intoInsetsCompat() = InsetsCompat.toCompatInsets(this)

// TODO: Consider looking through WindowInsetsCompat API and using it here if feasible
internal fun WindowInsets.resolveDisplayCutoutInsets(): InsetsCompat =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        this.getInsets(WindowInsets.Type.displayCutout()).intoInsetsCompat()
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        val displayCutout = this.displayCutout ?: return InsetsCompat.NONE
        InsetsCompat.of(
            displayCutout.safeInsetLeft,
            displayCutout.safeInsetTop,
            displayCutout.safeInsetRight,
            displayCutout.safeInsetBottom,
        )
    } else {
        InsetsCompat.NONE
    }

internal fun WindowInsets.resolveSystemBarsInsets(): InsetsCompat =
        WindowInsetsCompat.toWindowInsetsCompat(this).getInsets(WindowInsetsCompat.Type.systemBars())

/**
 * Meaningful value is available only in case the receiver is attached to window.
 * Otherwise returns zero-insets.
 */
internal fun View.resolveDisplayCutoutInsets(sourceWindowInsets: WindowInsets? = null): InsetsCompat =
    (sourceWindowInsets ?: rootWindowInsets)?.resolveDisplayCutoutInsets() ?: InsetsCompat.NONE

/**
 * Meaningful value is available only in case the receiver is attached to window.
 * Otherwise returns zero-insets.
 */
internal fun View.resolveSystemBarInsets(sourceWindowInsets: WindowInsets? = null): InsetsCompat =
    (sourceWindowInsets ?: rootWindowInsets)?.resolveSystemBarsInsets() ?: InsetsCompat.NONE
