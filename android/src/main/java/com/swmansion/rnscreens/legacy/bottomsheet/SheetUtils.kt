package com.swmansion.rnscreens.legacy.bottomsheet

import android.util.Log
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_COLLAPSED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HALF_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HIDDEN
import com.swmansion.rnscreens.legacy.Screen
import com.swmansion.rnscreens.legacy.ext.asScreenStackFragment

private const val TAG = "SheetUtils"

object SheetUtils {
    /**
     * Verifies whether BottomSheetBehavior.State is one of stable states. As unstable states
     * we consider `STATE_DRAGGING` and `STATE_SETTLING`.
     *
     * @param state bottom sheet state to verify
     */
    fun isStateStable(state: Int): Boolean =
        when (state) {
            STATE_HIDDEN,
            STATE_EXPANDED,
            STATE_COLLAPSED,
            STATE_HALF_EXPANDED,
            -> true

            else -> false
        }

    /**
     * This method maps indices from legal detents array (prop) to appropriate values
     * recognized by BottomSheetBehaviour. In particular used when setting up the initial behaviour
     * of the form sheet.
     *
     * @param index index from array with detents fractions
     * @param detentCount length of array with detents fractions
     *
     * @throws IllegalArgumentException for invalid index / detentCount combinations
     */
    fun sheetStateFromDetentIndex(
        index: Int,
        detentCount: Int,
    ): Int =
        when (detentCount) {
            1 ->
                when (index) {
                    -1 -> STATE_HIDDEN
                    0 -> STATE_EXPANDED
                    else -> throw IllegalArgumentException("[RNScreens] Invalid detentCount/index combination $detentCount / $index")
                }

            2 ->
                when (index) {
                    -1 -> STATE_HIDDEN
                    0 -> STATE_COLLAPSED
                    1 -> STATE_EXPANDED
                    else -> throw IllegalArgumentException("[RNScreens] Invalid detentCount/index combination $detentCount / $index")
                }

            3 ->
                when (index) {
                    -1 -> STATE_HIDDEN
                    0 -> STATE_COLLAPSED
                    1 -> STATE_HALF_EXPANDED
                    2 -> STATE_EXPANDED
                    else -> throw IllegalArgumentException("[RNScreens] Invalid detentCount/index combination $detentCount / $index")
                }

            else -> throw IllegalArgumentException("[RNScreens] Invalid detentCount/index combination $detentCount / $index")
        }

    /**
     * This method maps BottomSheetBehavior.State values to appropriate indices of detents array.
     *
     * @param state state of the bottom sheet
     * @param detentCount length of array with detents fractions
     *
     * A stable state that the current detents array cannot express is clamped to the top-most
     * detent rather than throwing, see [unmappedDetentIndex].
     */
    fun detentIndexFromSheetState(
        @BottomSheetBehavior.State state: Int,
        detentCount: Int,
    ): Int =
        when (detentCount) {
            1 ->
                when (state) {
                    STATE_HIDDEN -> -1
                    STATE_EXPANDED -> 0
                    else -> unmappedDetentIndex(state, detentCount)
                }

            2 ->
                when (state) {
                    STATE_HIDDEN -> -1
                    STATE_COLLAPSED -> 0
                    STATE_EXPANDED -> 1
                    else -> unmappedDetentIndex(state, detentCount)
                }

            3 ->
                when (state) {
                    STATE_HIDDEN -> -1
                    STATE_COLLAPSED -> 0
                    STATE_HALF_EXPANDED -> 1
                    STATE_EXPANDED -> 2
                    else -> unmappedDetentIndex(state, detentCount)
                }

            else -> unmappedDetentIndex(state, detentCount)
        }

    /**
     * Maps a stable [BottomSheetBehavior.State] that the current detents array cannot express.
     *
     * This is reachable through ordinary prop updates: when `sheetAllowedDetents` shrinks while the
     * sheet rests in a detent that no longer exists, Material keeps reporting the old state until
     * the sheet is re-settled. Going from `[0.5, 1]` to `[1]` while collapsed, for example, delivers
     * STATE_COLLAPSED with a detentCount of 1.
     *
     * Throwing from a state change the user cannot avoid takes down the whole app, so clamp to the
     * top-most valid detent instead. The rewritten form sheet already treats an unmapped state as a
     * non-fatal case (`FORM_SHEET_UNKNOWN_DETENT_INDEX`); -1 cannot be reused here because this
     * mapping already spends it on STATE_HIDDEN, and reporting the sheet as dismissed would be
     * worse than reporting the nearest detent.
     */
    private fun unmappedDetentIndex(
        state: Int,
        detentCount: Int,
    ): Int {
        Log.w(TAG, "[RNScreens] State $state has no detent in an array of $detentCount, clamping to the top detent")
        return (detentCount - 1).coerceAtLeast(0)
    }

    fun isStateLessEqualThan(
        state: Int,
        otherState: Int,
    ): Boolean {
        if (state == otherState) {
            return true
        }
        if (state != STATE_HALF_EXPANDED && otherState != STATE_HALF_EXPANDED) {
            return state > otherState
        }
        if (state == STATE_HALF_EXPANDED) {
            return otherState == STATE_EXPANDED
        }
        if (state == STATE_COLLAPSED) {
            return otherState != STATE_HIDDEN
        }
        return false
    }
}

fun Screen.isSheetFitToContents(): Boolean =
    stackPresentation === Screen.StackPresentation.FORM_SHEET &&
        sheetDetents.count == 1 &&
        sheetDetents.shortest() == SheetDetents.SHEET_FIT_TO_CONTENTS

fun Screen.usesFormSheetPresentation(): Boolean = stackPresentation === Screen.StackPresentation.FORM_SHEET

fun Screen.requiresEnterTransitionPostponing(): Boolean {
    // On Fabric, system insets are applied after the initial layout pass. However,
    // the BottomSheet height might be measured earlier due to internal BottomSheet logic
    // or layout callbacks, before those insets are applied.
    // To ensure the BottomSheet height respects the top inset we delay starting the enter
    // transition until both layout and insets are fully applied.

    return !this.sheetShouldOverflowTopInset && this.usesFormSheetPresentation()
}

fun Screen.sheetShouldUseDimmingView(): Boolean {
    val currentDetentIndex =
        fragment?.asScreenStackFragment()?.sheetDelegate?.lastStableDetentIndex
            ?: sheetInitialDetentIndex
    return currentDetentIndex > sheetLargestUndimmedDetentIndex
}

/**
 * The view might not be laid out, but have cached dimensions e.g. when host fragment
 * is reattached to container.
 */
fun View.isLaidOutOrHasCachedLayout() = this.isLaidOut || height > 0 || width > 0

internal fun Screen.resolveClampedHeight(
    targetHeight: Int,
    currentTranslationY: Float,
): Int {
    val maxAvailableVerticalSpace =
        fragment
            ?.asScreenStackFragment()
            ?.sheetDelegate
            ?.tryResolveMaxFormSheetHeight() ?: return targetHeight

    // Please note that currentTranslationY is rather < 0 here.
    // The translation is included in constraining the available space, because the FormSheet can have some offset, e.g. to
    // avoid the keyboard.
    return targetHeight.coerceAtMost((maxAvailableVerticalSpace + currentTranslationY).toInt())
}
