package com.swmansion.rnscreens.gamma.helpers

import android.content.Context
import android.graphics.drawable.Drawable
import android.util.Log
import androidx.appcompat.content.res.AppCompatResources
import com.swmansion.rnscreens.gamma.tabs.TabScreen.Companion.TAG

internal fun getSystemDrawableResource(
    context: Context,
    iconName: String?,
): Drawable? {
    if (iconName == null) {
        return null
    }

    // Try to get resource app scope
    val appDrawableId = context.resources.getIdentifier(iconName, "drawable", context.packageName)

    if (appDrawableId > 0) {
        return AppCompatResources.getDrawable(context, appDrawableId)
    }

    // Try to get resource from system scope
    val systemDrawableId = context.resources.getIdentifier(iconName, "drawable", "android")

    if (systemDrawableId > 0) {
        return AppCompatResources.getDrawable(context, systemDrawableId)
    }

    Log.w(TAG, "TabScreen could not resolve drawable resource with the name $iconName")
    return null
}
