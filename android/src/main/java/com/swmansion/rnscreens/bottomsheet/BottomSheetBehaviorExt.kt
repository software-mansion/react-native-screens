package com.swmansion.rnscreens.bottomsheet

import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior

internal fun <T : View> BottomSheetBehavior<T>.useSingleDetent(
    maxAllowedHeight: Int? = null,
    forceExpandedState: Boolean = true,
): BottomSheetBehavior<T> {
    this.skipCollapsed = true
    this.isFitToContents = true
    if (forceExpandedState) {
        this.state = BottomSheetBehavior.STATE_EXPANDED
    }
    maxAllowedHeight?.let {
        maxHeight = maxAllowedHeight
    }
    return this
}

internal fun <T : View> BottomSheetBehavior<T>.useTwoDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    maxAllowedHeight: Int? = null,
): BottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = true
    state?.let { this.state = state }
    firstHeight?.let { peekHeight = firstHeight }
    maxAllowedHeight?.let { maxHeight = maxAllowedHeight }
    return this
}

internal fun <T : View> BottomSheetBehavior<T>.useThreeDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    maxAllowedHeight: Int? = null,
    halfExpandedRatio: Float? = null,
    expandedOffsetFromTop: Int? = null,
): BottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = false
    state?.let { this.state = state }
    firstHeight?.let { this.peekHeight = firstHeight }
    halfExpandedRatio?.let { this.halfExpandedRatio = halfExpandedRatio }
    expandedOffsetFromTop?.let { this.expandedOffset = expandedOffsetFromTop }
    maxAllowedHeight?.let { maxHeight = maxAllowedHeight }
    return this
}
