package com.swmansion.rnscreens.legacy.utils

import android.content.Context
import android.content.pm.PackageManager

object DeviceUtils {
    fun isPlatformAndroidTV(context: Context?): Boolean = context?.packageManager?.hasSystemFeature(
        PackageManager.FEATURE_LEANBACK) == true
}