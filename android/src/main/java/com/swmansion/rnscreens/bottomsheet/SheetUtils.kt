package com.swmansion.rnscreens.bottomsheet

import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_COLLAPSED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HALF_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HIDDEN
import com.swmansion.rnscreens.Screen

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
     * @throws IllegalArgumentException for invalid state / detentCount combinations
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
                    else -> throw IllegalArgumentException("[RNScreens] Invalid state $state for detentCount $detentCount")
                }

            2 ->
                when (state) {
                    STATE_HIDDEN -> -1
                    STATE_COLLAPSED -> 0
                    STATE_EXPANDED -> 1
                    else -> throw IllegalArgumentException("[RNScreens] Invalid state $state for detentCount $detentCount")
                }

            3 ->
                when (state) {
                    STATE_HIDDEN -> -1
                    STATE_COLLAPSED -> 0
                    STATE_HALF_EXPANDED -> 1
                    STATE_EXPANDED -> 2
                    else -> throw IllegalArgumentException("[RNScreens] Invalid state $state for detentCount $detentCount")
                }

            else -> throw IllegalArgumentException("[RNScreens] Invalid state $state for detentCount $detentCount")
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
            return otherState == BottomSheetBehavior.STATE_EXPANDED
        }
        if (state == STATE_COLLAPSED) {
            return otherState != STATE_HIDDEN
        }
        return false
    }
}

fun Screen.isSheetFitToContents(): Boolean =
    stackPresentation === Screen.StackPresentation.FORM_SHEET &&
        sheetDetents.count() == 1 &&
        sheetDetents.first() == Screen.SHEET_FIT_TO_CONTENTS

fun Screen.usesFormSheetPresentation(): Boolean = stackPresentation === Screen.StackPresentation.FORM_SHEET
