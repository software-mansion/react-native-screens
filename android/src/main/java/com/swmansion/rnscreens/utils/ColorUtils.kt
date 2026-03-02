package com.swmansion.rnscreens.utils

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.util.TypedValue
import androidx.annotation.ColorInt
import com.swmansion.rnscreens.gamma.tabs.appearance.TabsAppearanceApplicator.Companion.TAG

internal fun resolveColorAttr(
    context: Context,
    attr: Int,
    @ColorInt defaultColor: Int = Color.TRANSPARENT,
): Int {
    val typedValue = TypedValue()
    val resolved = context.theme.resolveAttribute(attr, typedValue, true)

    if (!resolved) {
        Log.w(TAG, "[RNScreens] Failed to resolve color attribute. Falling back to Color.TRANSPARENT.")
        return defaultColor
    }

    return typedValue.data
}
