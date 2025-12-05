package com.swmansion.rnscreens.utils

import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

/**
 * Retrieves the top system inset (such as status bar or display cutout) from the given decor view.
 * It works **only** for top-level components, for nested Screens, Toolbars, etc. we don't want to repeat
 * applying the same paddings, corrections.
 *
 * @param decorView The top-level window decor view.
 * @param subjectView The view for which we're taking further action with returned insets.
 * @return The top inset in pixels.
 */
internal fun getDecorViewTopInset(decorView: View, subjectView: View): Int {
    val location = IntArray(2)
    subjectView.getLocationOnScreen(location)
    val isTopLevel = location[1] == 0

    if (!isTopLevel) return 0

    val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return 0

    return getTopInset(insetsCompat)
}

private fun getTopInset(insetsCompat: WindowInsetsCompat): Int =
    insetsCompat
        .getInsets(
            WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
        ).top
