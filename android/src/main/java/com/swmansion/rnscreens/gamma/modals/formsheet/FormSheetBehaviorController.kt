package com.swmansion.rnscreens.gamma.modals.formsheet

import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

internal class FormSheetBehaviorController(
    private val sheetView: FrameLayout,
) {
    private val behavior = BottomSheetBehavior.from(sheetView)

    private var detents: FormSheetDetents? = null
    private var sheetAvailableSpace: Int = 0
    private var shouldApplyInitialState = false

    internal fun updateSheetDetents(detents: FormSheetDetents) {
        this.detents = detents
        shouldApplyInitialState = true
        reconfigureSheetBehavior()
    }

    /**
     * @param maxHeight - the full window height that detent fractions are measured against.
     * Using the full height lets a BottomSheet with large detent configured to slide
     * behind the status bar, where Material pads insets for us.
     */
    internal fun updateSheetAvailableSpace(maxHeight: Int) {
        if (maxHeight <= 0 || maxHeight == sheetAvailableSpace) {
            return
        }
        sheetAvailableSpace = maxHeight
        reconfigureSheetBehavior()
    }

    private fun reconfigureSheetBehavior() {
        val detents = detents ?: return
        if (sheetAvailableSpace <= 0) {
            return
        }

        val applyInitialState = shouldApplyInitialState

        when (detents.count) {
            1 -> configureSingleDetent(detents, applyInitialState)
            2 -> configureTwoDetents(detents, applyInitialState)
            3 -> configureThreeDetents(detents, applyInitialState)
            else -> throw IllegalStateException(
                "[RNScreens] Unsupported detent count ${detents.count}.",
            )
        }

        shouldApplyInitialState = false

        // Metrics were mutated on an already-measured sheet; force a fresh layout
        // pass so the behavior re-settles to the new detent instead of keeping its
        // stale height.
        sheetView.requestLayout()
    }

    private fun configureSingleDetent(
        detents: FormSheetDetents,
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
