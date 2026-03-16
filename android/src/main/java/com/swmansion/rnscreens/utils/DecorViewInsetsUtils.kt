package com.swmansion.rnscreens.utils

import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

/**
 * Retrieves the top system inset (such as status bar or display cutout) from the given decor view.
 *
 * @param decorView The top-level window decor view.
 * @return The top inset in pixels.
 */
internal fun getDecorViewTopInset(decorView: View): Int {
    val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return 0

    return getTopInset(insetsCompat)
}

private fun getTopInset(insetsCompat: WindowInsetsCompat): Int =
    insetsCompat
        .getInsets(
            WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
        ).top

internal fun isSoftKeyboardVisibleOrNull(decorView: View): Boolean? {
    val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return null

    return insetsCompat
        .isVisible(
            WindowInsetsCompat.Type.ime(),
        )
}
