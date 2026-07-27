package com.swmansion.rnscreens.modals.formsheet

internal interface FormSheetStackEntry {
    /**
     * How strongly this entry currently dims the content beneath it.
     */
    val dimmingRatio: Float

    /**
     * How much this entry is covered by the sheet directly above it: 0 uncovered, 1 fully covered.
     */
    var coverageRatio: Float

    /**
     * Called when a sheet below this one in the stack starts being dismissed.
     */
    fun onSheetBelowDismissed()
}
