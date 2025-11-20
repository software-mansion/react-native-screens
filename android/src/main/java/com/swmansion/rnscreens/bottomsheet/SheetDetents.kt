package com.swmansion.rnscreens.bottomsheet

import com.swmansion.rnscreens.Screen

class SheetDetents(
    private val rawDetents: List<Double>,
) {
    init {
        require(rawDetents.isNotEmpty()) { "[$TAG] At least one detent must be provided." }
        require(rawDetents.size <= 3) { "[$TAG] Maximum of 3 detents supported." }

        if (rawDetents.size == 1) {
            rawDetents[0].let {
                require(it in 0.0..1.0 || it == SHEET_FIT_TO_CONTENTS) {
                    "[$TAG] Detent value must be within 0.0 and 1.0, or SHEET_FIT_TO_CONTENTS should be defined, got $it."
                }
            }
        } else {
            rawDetents.forEach {
                require(it in 0.0..1.0) {
                    "[$TAG] Detent values must be within 0.0 and 1.0, got $it."
                }
            }
        }
    }

    val count: Int get() = rawDetents.size

    fun empty(): Boolean = count == 0

    fun at(index: Int): Double = rawDetents[index]

    fun last(): Double = rawDetents.last()

    fun heightAt(
        index: Int,
        containerHeight: Int,
    ): Int = (at(index).coerceIn(0.0, 1.0) * containerHeight).toInt()

    fun firstHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    fun maxAllowedHeight(containerHeight: Int): Int = heightAt(count - 1, containerHeight)

    fun maxAllowedHeightForFitToContents(screen: Screen): Int =
        screen.contentWrapper?.let { contentWrapper ->
            contentWrapper.height.takeIf {
                // subtree might not be laid out, e.g. after fragment reattachment
                // and view recreation, however since it is retained by
                // react-native it has its height cached. We want to use it.
                // Otherwise we would have to trigger RN layout manually.
                contentWrapper.isLaidOutOrHasCachedLayout()
            }
        } ?: 0

    fun halfExpandedRatio(): Float {
        if (count < 3) throw IllegalStateException("[$TAG] At least 3 detents required for halfExpandedRatio.")
        return (at(1) / at(2)).toFloat()
    }

    fun expandedOffsetFromTop(
        containerHeight: Int,
        topInset: Int = 0,
    ): Int {
        if (count < 3) throw IllegalStateException("[$TAG] At least 3 detents required for expandedOffsetFromTop.")
        return ((1 - at(2).coerceIn(0.0, 1.0)) * containerHeight).toInt() + topInset
    }

    fun peekHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    fun sheetStateFromIndex(index: Int): Int = SheetUtils.sheetStateFromDetentIndex(index, count)

    fun indexFromSheetState(state: Int): Int = SheetUtils.detentIndexFromSheetState(state, count)

    companion object {
        const val TAG = "SheetDetents"

        /**
         * This value describes value in sheet detents array that will be treated as `fitToContents` option.
         */
        const val SHEET_FIT_TO_CONTENTS = -1.0
    }
}
