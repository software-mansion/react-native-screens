package com.swmansion.rnscreens.utils

import android.os.Build
import android.view.WindowManager

/**
 * Compatibility wrapper for apps targeting API level 26 or later. See
 * https://developer.android.com/about/versions/oreo/android-8.0-changes.html#cwt
 */
internal object WindowOverlayCompat {

    private const val TYPE_APPLICATION_OVERLAY = 2038

    @Suppress("DEPRECATION")
    @JvmField
    val TYPE_SYSTEM_OVERLAY: Int =
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY
        else TYPE_APPLICATION_OVERLAY
}