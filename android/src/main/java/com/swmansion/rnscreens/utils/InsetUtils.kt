package com.swmansion.rnscreens.utils

import android.view.WindowInsets
import androidx.core.view.WindowInsetsCompat

internal object InsetUtils {
    // .toWindowInsets() will return platform insets on API >= 20 so we're good.
    internal val CONSUMED_PLATFORM_WINDOW_INSETS =
        WindowInsetsCompat.CONSUMED.toWindowInsets() as WindowInsets
}
