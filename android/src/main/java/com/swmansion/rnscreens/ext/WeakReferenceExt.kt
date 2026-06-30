package com.swmansion.rnscreens.ext

import android.os.Build
import java.lang.ref.WeakReference

internal fun <T> WeakReference<T>.refersToCompat(referent: T): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return this.refersTo(referent)
    } else {
        this.get()?.let { strongRef ->
            return strongRef === referent
        }
        // Compatibility with `refersTo`
        return referent == null
    }
}
