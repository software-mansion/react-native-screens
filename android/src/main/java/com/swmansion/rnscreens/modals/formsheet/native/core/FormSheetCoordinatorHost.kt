package com.swmansion.rnscreens.modals.formsheet.native.core

import android.content.Context
import android.widget.FrameLayout

/**
 * Transparent host inserted between Material's dialog `container` and its `CoordinatorLayout`.
 *
 * Every metric we hand to `BottomSheetBehavior` and the height of [FormSheetContainer] is derived from 
 * the height of the coordinator. The measure pass is the only point where the height is known *before*
 * the sheet gets measured, so reporting it from here keeps those values in sync with window resizes, 
 * e.g., orientation change in the same traversal, ensuring no stale frame is incoming.
 */
internal class FormSheetCoordinatorHost(
    context: Context,
) : FrameLayout(context) {
    internal fun interface OnAvailableHeightMeasuredListener {
        /**
         * Invoked at the beginning of every measure pass with the height the coordinator is about
         * to be measured with.
         */
        fun onAvailableHeightMeasured(height: Int)
    }

    internal var availableHeightListener: OnAvailableHeightMeasuredListener? = null

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        val height = MeasureSpec.getSize(heightMeasureSpec)
        if (MeasureSpec.getMode(heightMeasureSpec) != MeasureSpec.UNSPECIFIED && height > 0) {
            availableHeightListener?.onAvailableHeightMeasured(height)
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }
}
