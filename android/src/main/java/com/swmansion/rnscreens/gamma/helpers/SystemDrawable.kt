package com.swmansion.rnscreens.gamma.helpers

import android.content.Context
import android.content.res.Resources
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

    val id = Resources.getSystem().getIdentifier(iconName, "drawable", "android")

    if (id > 0) {
        return AppCompatResources.getDrawable(context, id)
    }

    Log.w(TAG, "TabScreen could not resolve drawable resource with the name $iconName")
    return null
}
