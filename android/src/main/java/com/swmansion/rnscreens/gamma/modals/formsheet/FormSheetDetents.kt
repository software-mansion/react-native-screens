package com.swmansion.rnscreens.gamma.modals.formsheet

internal class FormSheetDetents(
    rawDetents: List<Double>,
) {
    private val detents: List<Double> = rawDetents.toList()

    init {
        require(detents.isNotEmpty()) { "[RNScreens] At least one detent must be provided." }
        require(detents.size <= MAX_DETENTS) { "[RNScreens] Maximum of $MAX_DETENTS detents supported, got ${detents.size}." }

        detents.forEach {
            require(it in 0.0..1.0) {
                "[RNScreens] Detent values must be within 0.0 and 1.0, got $it."
            }
        }

        require(detents == detents.sorted()) {
            "[RNScreens] Detents must be sorted in ascending order."
        }
    }

    internal val count: Int get() = detents.size

    internal fun at(index: Int): Double = detents[index]

    internal fun heightAt(
        index: Int,
        containerHeight: Int,
    ): Int = (at(index) * containerHeight).toInt()

    internal fun firstHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    internal fun maxAllowedHeight(containerHeight: Int): Int = heightAt(count - 1, containerHeight)

    internal fun halfExpandedRatio(): Float {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for halfExpandedRatio." }
        return (at(1) / at(2)).toFloat()
    }

    internal fun expandedOffsetFromTop(
        containerHeight: Int,
        topInset: Int = 0,
    ): Int {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for expandedOffsetFromTop." }
        return ((1 - at(2)) * containerHeight).toInt() + topInset
    }

    companion object {
        const val MAX_DETENTS = 3
    }
}
