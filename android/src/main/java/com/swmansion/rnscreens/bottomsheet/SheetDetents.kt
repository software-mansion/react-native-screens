package com.swmansion.rnscreens.bottomsheet

import com.swmansion.rnscreens.Screen

class SheetDetents(
    rawDetents: List<Double>,
) {
    private val rawDetents: List<Double> = rawDetents.toList()

    init {
        require(rawDetents.isNotEmpty()) { "[RNScreens] At least one detent must be provided." }
        require(rawDetents.size <= 3) { "[RNScreens] Maximum of 3 detents supported." }

        if (rawDetents.size == 1) {
            rawDetents[0].let {
                require(it in 0.0..1.0 || it == SHEET_FIT_TO_CONTENTS) {
                    "[RNScreens] Detent value must be within 0.0 and 1.0, or SHEET_FIT_TO_CONTENTS should be defined, got $it."
                }
            }
        } else {
            rawDetents.forEach {
                require(it in 0.0..1.0) {
                    "[RNScreens] Detent values must be within 0.0 and 1.0, got $it."
                }
            }

            require(rawDetents == rawDetents.sorted()) {
                "[RNScreens] Detents must be sorted in ascending order."
            }
        }
    }

    internal val count: Int get() = rawDetents.size

    internal fun at(index: Int): Double = rawDetents[index]

    internal fun shortest(): Double = rawDetents.first()

    internal fun highest(): Double = rawDetents.last()

    internal fun heightAt(
        index: Int,
        containerHeight: Int,
    ): Int {
        val detent = at(index)
        require(detent != SHEET_FIT_TO_CONTENTS) {
            "[RNScreens] FIT_TO_CONTENTS is not supported by heightAt."
        }

        return (detent * containerHeight).toInt()
    }

    internal fun firstHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    internal fun maxAllowedHeight(containerHeight: Int): Int = heightAt(count - 1, containerHeight)

    internal fun maxAllowedHeightForFitToContents(screen: Screen): Int =
        screen.contentWrapper?.let { contentWrapper ->
            contentWrapper.height.takeIf {
                // subtree might not be laid out, e.g. after fragment reattachment
                // and view recreation, however since it is retained by
                // react-native it has its height cached. We want to use it.
                // Otherwise we would have to trigger RN layout manually.
                contentWrapper.isLaidOutOrHasCachedLayout()
            }
        } ?: 0

    internal fun halfExpandedRatio(): Float {
        if (count < 3) throw IllegalStateException("[RNScreens] At least 3 detents required for halfExpandedRatio.")
        return (at(1) / at(2)).toFloat()
    }

    internal fun expandedOffsetFromTop(
        containerHeight: Int,
        topInset: Int = 0,
    ): Int {
        if (count < 3) throw IllegalStateException("[RNScreens] At least 3 detents required for expandedOffsetFromTop.")
        return ((1 - at(2)) * containerHeight).toInt() + topInset
    }

    internal fun peekHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    internal fun sheetStateFromIndex(index: Int): Int = SheetUtils.sheetStateFromDetentIndex(index, count)

    internal fun indexFromSheetState(state: Int): Int = SheetUtils.detentIndexFromSheetState(state, count)

    companion object {
        /**
         * This value describes value in sheet detents array that will be treated as `fitToContents` option.
         */
        const val SHEET_FIT_TO_CONTENTS = -1.0
    }
}
