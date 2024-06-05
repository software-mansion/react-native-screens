package com.swmansion.rnscreens

import android.content.Context
import androidx.appcompat.widget.Toolbar

// This class is used to store config closer to search bar
open class CustomToolbar(context: Context, val config: ScreenStackHeaderConfig) : Toolbar(context) {
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        super.onLayout(changed, l, t, r, b)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

}
