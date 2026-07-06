package com.swmansion.rnscreens.gamma.modals.formsheet

import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

internal class FormSheetBehaviorController(
    private val sheetView: FrameLayout,
) {
    private val behavior = BottomSheetBehavior.from(sheetView)

    /**
     * @param detents - parsed detents configuration.
     * @param sheetAvailableSpace - the full window height that detent fractions are measured against.
     * Using the full height lets a BottomSheet with large detent configured to slide
     * behind the status bar, where Material pads insets for us.
     * @param contentHeightForFitToContents - the exact height of the content, e.g. React content calculated by Yoga.
     * Used exclusively when the sheet is in `fitToContents` mode.
     * @param nativeContainerPaddingBottom - the bottom system inset. In `fitToContents` mode, this is added to the
     * BottomSheet's height to extend its background behind the system bars, while the inner content remains within
     * the safe area.
     */
    internal fun updateSheetBehavior(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        contentHeightForFitToContents: Int = 0,
        nativeContainerPaddingBottom: Int = 0,
    ) {
        if (sheetAvailableSpace <= 0) {
            return
        }

        if (detents.isFitToContents) {
            configureFitToContents(detents, sheetAvailableSpace, contentHeightForFitToContents, nativeContainerPaddingBottom)
        } else {
            when (detents.count) {
                1 -> configureSingleDetent(detents, sheetAvailableSpace)
                2 -> configureTwoDetents(detents, sheetAvailableSpace)
                3 -> configureThreeDetents(detents, sheetAvailableSpace)
                else -> throw IllegalStateException(
                    "[RNScreens] Unsupported detent count ${detents.count}.",
                )
            }
        }

        // Metrics were mutated on an already-measured sheet; force a fresh layout
        // pass so the behavior re-settles to the new detent instead of keeping its
        // stale height.
        sheetView.requestLayout()
    }

    private fun configureFitToContents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        contentHeight: Int,
        bottomInset: Int,
    ) = behavior.apply {
        skipCollapsed = true
        isFitToContents = true
        maxHeight = detents.maxAllowedHeightForFitToContents(sheetAvailableSpace, contentHeight, bottomInset)
        state = BottomSheetBehavior.STATE_EXPANDED
    }

    private fun configureSingleDetent(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
    ) = behavior.apply {
        skipCollapsed = true
        isFitToContents = true
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        state = BottomSheetBehavior.STATE_EXPANDED
    }

    private fun configureTwoDetents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = true
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        // TODO: @t0maboro - in v4 impl the state was passed as a param, consider the same approach
        state = BottomSheetBehavior.STATE_COLLAPSED
    }

    private fun configureThreeDetents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = false
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        halfExpandedRatio = detents.halfExpandedRatio()
        expandedOffset = detents.expandedOffsetFromTop(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        // TODO: @t0maboro - in v4 impl the state was passed as a param, consider the same approach
        state = BottomSheetBehavior.STATE_COLLAPSED
    }
}
