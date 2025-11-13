package com.swmansion.rnscreens.utils

import android.content.Context
import android.os.Build
import android.util.TypedValue

fun pxToDp(context: Context, px: Float): Float {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        return TypedValue.deriveDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            px,
            context.resources.displayMetrics
        )
    } else {
        val density = context.resources.displayMetrics.density
        return px / density
    }
}