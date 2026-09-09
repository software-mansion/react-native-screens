package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import android.view.View
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents

internal class FormSheetBehaviorController(
    private val sheetView: FrameLayout,
    private val onDetentChanged: ((index: Int) -> Unit)? = null,
) {
    private val behavior = BottomSheetBehavior.from(sheetView)

    private var currentDetentsCount: Int = 1
    private var lastEmittedDetentIndex: Int = FORM_SHEET_UNKNOWN_DETENT_INDEX
    private var lastStableState: Int = BottomSheetBehavior.STATE_COLLAPSED

    private val bottomSheetCallback =
        object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                rememberStateIfStable(newState)

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
        rememberStateIfStable(behavior.state)
    }

    internal fun setup() {
        behavior.addBottomSheetCallback(bottomSheetCallback)
    }

    internal fun destroy() {
        behavior.removeBottomSheetCallback(bottomSheetCallback)
    }

    internal fun restoreLastStableState() {
        if (behavior.state != BottomSheetBehavior.STATE_HIDDEN) {
            return
        }

        behavior.state = lastStableState
    }

    private fun rememberStateIfStable(state: Int) {
        val isVisibleRestingState =
            state == BottomSheetBehavior.STATE_EXPANDED ||
                state == BottomSheetBehavior.STATE_COLLAPSED ||
                state == BottomSheetBehavior.STATE_HALF_EXPANDED

        if (isVisibleRestingState) {
            lastStableState = state
        }
    }

    /**
     * Expected to be called from the measure pass, before the sheet is measured (see
     * `FormSheetAvailableHeightProvider`), so the metrics below are consumed by the ongoing traversal.
     *
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
            state = resolveStateFromIndex(detents, initialDetentIndex)
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
            state = resolveStateFromIndex(detents, initialDetentIndex)
        }
    }

    private fun resolveStateFromIndex(
        detents: FormSheetDetents,
        requestedIndex: Int,
    ): Int {
        val index = detents.resolveDetentIndex(requestedIndex)

        return when (detents.count) {
            1 -> BottomSheetBehavior.STATE_EXPANDED
            2 -> if (index == 0) BottomSheetBehavior.STATE_COLLAPSED else BottomSheetBehavior.STATE_EXPANDED
            3 ->
                when (index) {
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
    }
}
