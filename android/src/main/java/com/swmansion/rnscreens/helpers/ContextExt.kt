package com.swmansion.rnscreens.helpers

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import com.facebook.react.bridge.ReactContext

internal fun Context.findHostActivity(): Activity? {
    var current: Context? = this
    while (current is ContextWrapper) {
        if (current is Activity) {
            return current
        }
        if (current is ReactContext) {
            return current.currentActivity
        }
        current = current.baseContext
    }
    return null
}
