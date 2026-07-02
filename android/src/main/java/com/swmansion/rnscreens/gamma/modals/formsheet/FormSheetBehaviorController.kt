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
     * @param applyInitialState - whether to force the sheet to snap to its default starting position
     * Should be set to `true` when the detents configuration changes.
     */
    internal fun updateSheetBehavior(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        applyInitialState: Boolean = false,
    ) {
        if (sheetAvailableSpace <= 0) {
            return
        }

        when (detents.count) {
            1 -> configureSingleDetent(detents, sheetAvailableSpace, applyInitialState)
            2 -> configureTwoDetents(detents, sheetAvailableSpace, applyInitialState)
            3 -> configureThreeDetents(detents, sheetAvailableSpace, applyInitialState)
            else -> throw IllegalStateException(
                "[RNScreens] Unsupported detent count ${detents.count}.",
            )
        }

        // Metrics were mutated on an already-measured sheet; force a fresh layout
        // pass so the behavior re-settles to the new detent instead of keeping its
        // stale height.
        sheetView.requestLayout()
    }

    private fun configureSingleDetent(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        applyInitialState: Boolean,
    ) = behavior.apply {
        skipCollapsed = true
        isFitToContents = true
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        if (applyInitialState) {
            state = BottomSheetBehavior.STATE_EXPANDED
        }
    }

    private fun configureTwoDetents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        applyInitialState: Boolean,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = true
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        // TODO: @t0maboro - in v4 impl the state was passed as a param, consider the same approach
        if (applyInitialState) {
            state = BottomSheetBehavior.STATE_COLLAPSED
        }
    }

    private fun configureThreeDetents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        applyInitialState: Boolean,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = false
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        halfExpandedRatio = detents.halfExpandedRatio()
        expandedOffset = detents.expandedOffsetFromTop(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        // TODO: @t0maboro - in v4 impl the state was passed as a param, consider the same approach
        if (applyInitialState) {
            state = BottomSheetBehavior.STATE_COLLAPSED
        }
    }
}
