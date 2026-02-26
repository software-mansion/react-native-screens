package com.swmansion.rnscreens.utils

import android.util.Log

// TODO: Find better way to handle platform specific props
internal fun logNotAvailable(propName: String) {
    Log.w("[RNScreens]", "$propName prop is not available on Android")
}
