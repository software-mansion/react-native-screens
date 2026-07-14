package com.swmansion.rnscreens.gamma.modals.formsheet

import android.view.View
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

internal class FormSheetBehaviorController(
    private val sheetView: FrameLayout,
    private val onDetentChanged: ((index: Int) -> Unit)? = null,
) {
    private val behavior = BottomSheetBehavior.from(sheetView)

    private var currentDetentsCount: Int = 1
    private var lastEmittedDetentIndex: Int = FORM_SHEET_UNKNOWN_DETENT_INDEX

    private val bottomSheetCallback =
        object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                val index = mapStateToDetentIndex(newState)
                if (index != FORM_SHEET_UNKNOWN_DETENT_INDEX && index != lastEmittedDetentIndex) {
                    lastEmittedDetentIndex = index
                    onDetentChanged?.invoke(index)
                }
            }

            override fun onSlide(
                bottomSheet: View,
                slideOffset: Float,
            ) = Unit
        }

    init {
        behavior.isHideable = true
    }

    internal fun setup() {
        behavior.addBottomSheetCallback(bottomSheetCallback)
    }

    internal fun destroy() {
        behavior.removeBottomSheetCallback(bottomSheetCallback)
    }

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
     * @param initialDetentIndex - the index of the detent the sheet should snap to while opening.
     * @param applyInitialDetent - whether the sheet should forcefully snap to the initial detent state.
     * This should typically be `true` only when the sheet transitions from closed to open.
     */
    internal fun updateSheetBehavior(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        contentHeightForFitToContents: Int = 0,
        nativeContainerPaddingBottom: Int = 0,
        initialDetentIndex: Int = 0,
        applyInitialDetent: Boolean = false,
    ) {
        currentDetentsCount = detents.count

        if (sheetAvailableSpace <= 0) {
            return
        }

        if (detents.isFitToContents) {
            configureFitToContents(detents, sheetAvailableSpace, contentHeightForFitToContents, nativeContainerPaddingBottom)
        } else {
            when (detents.count) {
                1 -> configureSingleDetent(detents, sheetAvailableSpace)
                2 -> configureTwoDetents(detents, sheetAvailableSpace, initialDetentIndex, applyInitialDetent)
                3 -> configureThreeDetents(detents, sheetAvailableSpace, initialDetentIndex, applyInitialDetent)
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
        initialDetentIndex: Int,
        applyInitialDetent: Boolean,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = true
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        if (applyInitialDetent) {
            state = resolveStateFromIndex(initialDetentIndex, detents.count)
        }
    }

    private fun configureThreeDetents(
        detents: FormSheetDetents,
        sheetAvailableSpace: Int,
        initialDetentIndex: Int,
        applyInitialDetent: Boolean,
    ) = behavior.apply {
        skipCollapsed = false
        isFitToContents = false
        peekHeight = detents.firstHeight(sheetAvailableSpace)
        halfExpandedRatio = detents.halfExpandedRatio()
        expandedOffset = detents.expandedOffsetFromTop(sheetAvailableSpace)
        maxHeight = detents.maxAllowedHeight(sheetAvailableSpace)
        if (applyInitialDetent) {
            state = resolveStateFromIndex(initialDetentIndex, detents.count)
        }
    }

    private fun resolveStateFromIndex(
        index: Int,
        detentsCount: Int,
    ): Int {
        val resolvedIndex = if (index == FORM_SHEET_LAST_DETENT_INDEX) detentsCount - 1 else index
        val safeIndex = resolvedIndex.coerceIn(0, detentsCount - 1)

        return when (detentsCount) {
            1 -> BottomSheetBehavior.STATE_EXPANDED
            2 -> if (safeIndex == 0) BottomSheetBehavior.STATE_COLLAPSED else BottomSheetBehavior.STATE_EXPANDED
            3 ->
                when (safeIndex) {
                    0 -> BottomSheetBehavior.STATE_COLLAPSED
                    1 -> BottomSheetBehavior.STATE_HALF_EXPANDED
                    else -> BottomSheetBehavior.STATE_EXPANDED
                }
            else -> BottomSheetBehavior.STATE_COLLAPSED
        }
    }

    private fun mapStateToDetentIndex(state: Int): Int =
        when (currentDetentsCount) {
            1 -> if (state == BottomSheetBehavior.STATE_EXPANDED) 0 else FORM_SHEET_UNKNOWN_DETENT_INDEX
            2 ->
                when (state) {
                    BottomSheetBehavior.STATE_COLLAPSED -> 0
                    BottomSheetBehavior.STATE_EXPANDED -> 1
                    else -> FORM_SHEET_UNKNOWN_DETENT_INDEX
                }
            3 ->
                when (state) {
                    BottomSheetBehavior.STATE_COLLAPSED -> 0
                    BottomSheetBehavior.STATE_HALF_EXPANDED -> 1
                    BottomSheetBehavior.STATE_EXPANDED -> 2
                    else -> FORM_SHEET_UNKNOWN_DETENT_INDEX
                }
            else -> FORM_SHEET_UNKNOWN_DETENT_INDEX
        }

    companion object {
        private const val FORM_SHEET_UNKNOWN_DETENT_INDEX = -1
        private const val FORM_SHEET_LAST_DETENT_INDEX = -1
    }
}
