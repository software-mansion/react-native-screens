package com.swmansion.rnscreens.modals.formsheet.native.core

import android.content.Context
import android.view.View

/**
 * View installed as the first child of the window's `android.R.id.content`, as a sibling
 * of Material's dialog `container` - nothing in Material's hierarchy is moved.
 *
 * Every metric we hand to `BottomSheetBehavior` and the height of [FormSheetContainer] is derived from
 * the height the sheet is measured against. The measure pass is the only point where that height is known
 * *before* the sheet gets measured. `FrameLayout` measures its children in index order, so the provider reports
 * the height right before Material's `container`, the coordinator and the sheet are measured in the same
 * traversal, keeping those values in sync with window resizes, e.g. orientation change.
 */
internal class FormSheetAvailableHeightProvider(
    context: Context,
) : View(context) {
    internal fun interface OnAvailableHeightMeasuredListener {
        /**
         * Invoked at the beginning of every measure pass with the height the sheet is about
         * to be measured against.
         */
        fun onAvailableHeightMeasured(height: Int)
    }

    internal var availableHeightListener: OnAvailableHeightMeasuredListener? = null

    init {
        visibility = INVISIBLE
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    }

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
