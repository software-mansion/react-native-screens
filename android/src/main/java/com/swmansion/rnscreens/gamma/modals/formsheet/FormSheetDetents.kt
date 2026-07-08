package com.swmansion.rnscreens.gamma.modals.formsheet

internal class FormSheetDetents(
    rawDetents: List<Double>,
) {
    private val detents: List<Double> = rawDetents.toList()

    init {
        require(detents.isNotEmpty()) { "[RNScreens] At least one detent must be provided." }
        require(detents.size <= MAX_DETENTS) { "[RNScreens] Maximum of $MAX_DETENTS detents supported, got ${detents.size}." }

        // Valid fitToContents configuration is a single detent with value -1.0.
        // For any other configuration, we should validate provided detents array.
        if (!isFitToContents) {
            detents.forEach {
                require(it in 0.0..1.0) {
                    "[RNScreens] Detent values must be within 0.0 and 1.0, got $it."
                }
            }

            require(detents == detents.distinct().sorted()) {
                "[RNScreens] Detents must be sorted in strictly ascending order."
            }
        }
    }

    internal val isFitToContents: Boolean
        get() = detents.size == 1 && detents[0] == FIT_TO_CONTENTS_DETENT_VALUE

    internal val count: Int get() = detents.size

    private fun heightFractionAt(index: Int): Double = detents[index]

    private fun heightAt(
        index: Int,
        containerHeight: Int,
    ): Int = (heightFractionAt(index) * containerHeight).toInt()

    internal fun firstHeight(containerHeight: Int): Int = heightAt(0, containerHeight)

    internal fun maxAllowedHeight(containerHeight: Int): Int = heightAt(count - 1, containerHeight)

    internal fun maxAllowedHeightForFitToContents(
        containerHeight: Int,
        contentHeight: Int,
        bottomInset: Int,
    ): Int {
        /*
         * We add the `bottomInset` to the `contentHeight` so that the Material BottomSheet
         * is laid out behind the system navigation bar. The sheet's container covers the insets,
         * while the RN content is strictly constrained to `contentHeight`.
         */
        if (contentHeight <= 0) {
            // Avoid collapsing the sheet before the React content has been laid out and measured.
            return containerHeight
        }
        return (contentHeight + bottomInset).coerceAtMost(containerHeight)
    }

    internal fun halfExpandedRatio(): Float {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for halfExpandedRatio." }
        return (heightFractionAt(1) / heightFractionAt(2)).toFloat()
    }

    internal fun expandedOffsetFromTop(
        containerHeight: Int,
        topInset: Int = 0,
    ): Int {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for expandedOffsetFromTop." }
        return ((1 - heightFractionAt(2)) * containerHeight).toInt() + topInset
    }

    // Distance from the top of the window to the top of the largest detent's surface.
    private fun largestDetentTopOffset(containerHeight: Int): Int = containerHeight - maxAllowedHeight(containerHeight)

    /**
     * Material's BottomSheetDialog dynamically applies padding when its content overlaps
     * system insets. To prevent recalculating the size, we pre-calculate a static height
     * inside safe area bounds.
     */
    internal fun sheetContainerHeight(
        containerHeight: Int,
        topInset: Int,
        bottomInset: Int,
        contentHeight: Int = 0,
    ): Int {
        if (isFitToContents) {
            // Until we have a measured content height, fall back to a safe-area height so Yoga can lay out.
            if (contentHeight <= 0) {
                return (containerHeight - topInset - bottomInset).coerceAtLeast(0)
            }
            return contentHeight.coerceAtMost(containerHeight)
        }

        // Bottom inset is always fully subtracted because the sheet is in its dedicated window and it's
        // anchored to the bottom.
        // Top inset is subtracted only by the amount the sheet actually overlaps it.
        val topOverlap = (topInset - largestDetentTopOffset(containerHeight)).coerceAtLeast(0)
        return (maxAllowedHeight(containerHeight) - topOverlap - bottomInset).coerceAtLeast(0)
    }

    companion object {
        const val MAX_DETENTS = 3
        const val FIT_TO_CONTENTS_DETENT_VALUE = -1.0
    }
}
