package com.swmansion.rnscreens.bottomsheet

import com.swmansion.rnscreens.Screen

data class BottomSheetMetrics(
    val availableHeight: Int,
    val maxDetent: Double,
    val maxSheetHeight: Int,
)

fun getSheetMetrics(
    screen: Screen,
    availableHeight: Int,
    sheetHeight: Int,
): BottomSheetMetrics {
    val maxDetent = screen.sheetDetents.lastOrNull() ?: 1.0

    val maxSheetHeight =
        when {
            screen.usesFormSheetPresentation() && screen.isSheetFitToContents() -> sheetHeight
            else -> (availableHeight * maxDetent).toInt()
        }

    return BottomSheetMetrics(
        availableHeight = availableHeight,
        maxDetent = maxDetent,
        maxSheetHeight = maxSheetHeight,
    )
}
