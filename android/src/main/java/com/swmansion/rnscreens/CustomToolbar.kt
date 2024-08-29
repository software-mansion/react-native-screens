package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import androidx.appcompat.widget.Toolbar

// This class is used to store config closer to search bar
@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
open class CustomToolbar(
    context: Context,
    val config: ScreenStackHeaderConfig,
) : Toolbar(context) {
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        super.onLayout(changed, l, t, r, b)

        // our children are already laid out
        val contentInsetStart = if (navigationIcon != null) contentInsetStartWithNavigation else contentInsetStart
        config.updatePaddingsFabric(contentInsetStart, contentInsetEnd)
    }
}
