package com.swmansion.rnscreens.utils

import android.app.Activity
import android.os.Build
import android.view.WindowInsets
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.R)
internal fun getWindowManagerTopInset(activity: Activity): Int {
    val windowMetrics = activity.windowManager.maximumWindowMetrics
    val insets =
        windowMetrics.windowInsets.getInsetsIgnoringVisibility(
            WindowInsets.Type.statusBars() or WindowInsets.Type.displayCutout(),
        )

    return insets.top
}
