package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.material.appbar.AppBarLayout

@SuppressLint("ViewConstructor")
class CustomAppBarLayout(
    context: Context,
) : AppBarLayout(context) {
    /**
     * Handles the layout correction from the child Toolbar.
     */
    fun onToolbarLayout(toolbarPaddingTop: Int) {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height + toolbarPaddingTop, MeasureSpec.EXACTLY),
        )
        layout(left, top, right, bottom + toolbarPaddingTop)
    }
}
