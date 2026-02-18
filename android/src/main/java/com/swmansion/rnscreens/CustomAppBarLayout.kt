package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import com.google.android.material.appbar.AppBarLayout

@SuppressLint("ViewConstructor")
class CustomAppBarLayout(
    context: Context,
) : AppBarLayout(context) {
    /**
     * Handles the layout correction from the child Toolbar.
     */
    internal fun applyToolbarLayoutCorrection(toolbarPaddingTop: Int) {
        Log.d("SCREENS", "CustomAppBarLayout // applyToolbarLayoutCorrection paddingTop = %d".format(toolbarPaddingTop));
        applyFrameCorrectionByTopInset(toolbarPaddingTop)
    }

    private fun applyFrameCorrectionByTopInset(topInset: Int) {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height + topInset, MeasureSpec.EXACTLY),
        )
        layout(left, top, right, bottom + topInset)
    }
}
