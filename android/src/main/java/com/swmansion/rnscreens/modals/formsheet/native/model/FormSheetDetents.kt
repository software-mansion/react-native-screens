package com.swmansion.rnscreens.modals.formsheet.native.model

import kotlin.math.roundToInt

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

    // Height of the sheet resting at the given detent, measured down to the bottom edge of the container.
    private fun heightAt(
        index: Int,
        containerHeight: Int,
        keyboardLift: Int,
    ): Int = ((heightFractionAt(index) * containerHeight).roundToInt() + keyboardLift).coerceAtMost(containerHeight)

    /**
     * Height handed to Material as `peekHeight`. Material treats the peek height as the content height above
     * the bottom inset and adds that inset back (`BottomSheetBehavior.calculatePeekHeight`), while every
     * other metric (`maxHeight`, `halfExpandedRatio`) describes the sheet down to the screen edge. The inset is
     * subtracted here so the lowest detent is resolved against the same reference as the other ones.
     * Material's inset covers the keyboard as well, so the lift is subtracted along with the system inset.
     */
    internal fun peekHeight(
        containerHeight: Int,
        bottomInset: Int,
        keyboardLift: Int = 0,
    ): Int = (heightAt(0, containerHeight, keyboardLift) - bottomInset - keyboardLift).coerceAtLeast(0)

    internal fun maxAllowedHeight(
        containerHeight: Int,
        keyboardLift: Int = 0,
    ): Int = heightAt(count - 1, containerHeight, keyboardLift)

    internal fun maxAllowedHeightForFitToContents(
        containerHeight: Int,
        contentHeight: Int,
        bottomInset: Int,
        keyboardLift: Int = 0,
    ): Int {
        /*
         * We add the `bottomInset` and the `keyboardLift` to the `contentHeight` so that the Material BottomSheet
         * is laid out behind the system navigation bar or the keyboard. The sheet's container covers the insets,
         * while the RN content is strictly constrained to `contentHeight`.
         */
        if (contentHeight <= 0) {
            // Avoid collapsing the sheet before the React content has been laid out and measured.
            return containerHeight
        }
        return (contentHeight + bottomInset + keyboardLift).coerceAtMost(containerHeight)
    }

    /**
     * Ratio of the middle detent's sheet height to the container height, handed to Material as `halfExpandedRatio`.
     * Material resolves the half-expanded position from it as `(int) (parentHeight * (1 - ratio))`.
     *
     * The keyboard lift can push both the middle and the largest detent to the top of the container. Material needs
     * the half-expanded position strictly below the expanded one so the middle detent is kept at least
     * [MIDDLE_DETENT_MIN_GAP] px shorter than the largest one.
     */
    internal fun halfExpandedRatio(
        containerHeight: Int,
        keyboardLift: Int = 0,
    ): Float {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for halfExpandedRatio." }
        val middleDetentHeight =
            heightAt(1, containerHeight, keyboardLift)
                .coerceAtMost(maxAllowedHeight(containerHeight, keyboardLift) - MIDDLE_DETENT_MIN_GAP)
                .coerceAtLeast(1)
        return middleDetentHeight.toFloat() / containerHeight
    }

    internal fun expandedOffsetFromTop(
        containerHeight: Int,
        topInset: Int = 0,
        keyboardLift: Int = 0,
    ): Int {
        check(count == MAX_DETENTS) { "[RNScreens] Exactly $MAX_DETENTS detents are required for expandedOffsetFromTop." }
        return largestDetentTopOffset(containerHeight, keyboardLift) + topInset
    }

    // Distance from the top of the window to the top of the largest detent's surface.
    private fun largestDetentTopOffset(
        containerHeight: Int,
        keyboardLift: Int,
    ): Int = containerHeight - maxAllowedHeight(containerHeight, keyboardLift)

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
        keyboardLift: Int = 0,
    ): Int {
        val bottomPadding = bottomInset + keyboardLift

        if (isFitToContents) {
            // Until we have a measured content height, fall back to a safe-area height so Yoga can lay out.
            if (contentHeight <= 0) {
                return (containerHeight - topInset - bottomPadding).coerceAtLeast(0)
            }
            // Content taller than the safe area is aligned with it.
            return contentHeight.coerceAtMost((containerHeight - topInset - bottomPadding).coerceAtLeast(0))
        }

        // Bottom padding is always fully subtracted because the sheet is in its dedicated window and it's
        // anchored to the bottom.
        // Top inset is subtracted only by the amount the sheet actually overlaps it.
        val topOverlap = (topInset - largestDetentTopOffset(containerHeight, keyboardLift)).coerceAtLeast(0)
        return (maxAllowedHeight(containerHeight, keyboardLift) - topOverlap - bottomPadding).coerceAtLeast(0)
    }

    companion object {
        const val MAX_DETENTS = 3
        const val FIT_TO_CONTENTS_DETENT_VALUE = -1.0

        // Material resolves the half-expanded position in float precision and the truncation to int can eat 1 px
        // which would put the middle detent back on the expanded position.
        private const val MIDDLE_DETENT_MIN_GAP = 2
    }
}
