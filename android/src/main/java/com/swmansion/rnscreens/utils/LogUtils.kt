package com.swmansion.rnscreens.utils

import android.util.Log

internal fun logNotAvailable(propName: String) {
    Log.w("[RNScreens]", "$propName prop is not available on Android")
}