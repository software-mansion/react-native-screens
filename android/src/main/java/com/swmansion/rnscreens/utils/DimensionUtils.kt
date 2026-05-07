package com.swmansion.rnscreens.utils

import android.content.Context
import android.util.TypedValue

internal fun resolveDimensionAttr(
    context: Context,
    attrId: Int,
): Int {
    val typedValue = TypedValue()
    require(context.theme.resolveAttribute(attrId, typedValue, true)) {
        "[RNScreens] Unable to resolve Material theme dimension."
    }
    return TypedValue.complexToDimensionPixelSize(
        typedValue.data,
        context.resources.displayMetrics,
    )
}
