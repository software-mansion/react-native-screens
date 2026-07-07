package com.swmansion.rnscreens.utils

import android.content.Context
import android.graphics.drawable.Drawable
import android.util.Log
import android.util.TypedValue
import androidx.appcompat.content.res.AppCompatResources

private const val TAG = "DrawableUtils"

internal fun resolveDrawableAttr(
    context: Context,
    attrId: Int,
): Drawable? {
    val typedValue = TypedValue()
    if (!context.theme.resolveAttribute(attrId, typedValue, true) ||
        typedValue.resourceId == 0
    ) {
        Log.w(TAG, "[RNScreens] Failed to resolve drawable attribute.")
        return null
    }
    return AppCompatResources.getDrawable(context, typedValue.resourceId)
}
