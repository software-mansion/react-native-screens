package com.swmansion.rnscreens.utils

import android.view.View
import android.view.WindowInsets
import androidx.core.view.WindowInsetsCompat

typealias InsetsCompat = androidx.core.graphics.Insets
typealias InsetsPlatform = android.graphics.Insets // Available since SDK 29

/**
 * Meaningful value is available only in case the receiver is attached to window.
 * Otherwise returns zero-insets.
 *
 * By default this method relies on `rootWindowInsets` of a view. Set `sourceWindowInsets` to change that.
 */
internal fun View.resolveInsetsOrZero(
    @WindowInsetsCompat.Type.InsetsType insetType: Int,
    sourceWindowInsets: WindowInsets? = rootWindowInsets,
    ignoreVisibility: Boolean = false,
): InsetsCompat {
    if (sourceWindowInsets == null) {
        return InsetsCompat.NONE
    }

    val windowInsetsCompat = WindowInsetsCompat.toWindowInsetsCompat(sourceWindowInsets, this)
    return if (!ignoreVisibility) {
        windowInsetsCompat.getInsets(insetType)
    } else {
        windowInsetsCompat.getInsetsIgnoringVisibility(insetType)
    }
}
