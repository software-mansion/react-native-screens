package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.view.View
import android.view.ViewGroup
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis

/**
 * The pixel space one screen animates in.
 */
internal data class LayoutMetrics(
    val containerWidth: Int,
    val containerHeight: Int,
    val density: Float,
    val isRTL: Boolean,
) {
    /**
     * [length] in pixels along [axis]; a logical X mirrors in a right-to-left container.
     */
    internal fun toPx(
        length: Length,
        axis: Axis,
    ): Float {
        val px =
            when (length) {
                is Length.Dp -> length.value * density
                is Length.Percent ->
                    length.fraction *
                        when (axis) {
                            Axis.X, Axis.LOGICAL_X -> containerWidth
                            Axis.Y -> containerHeight
                        }
            }
        return if (axis == Axis.LOGICAL_X && isRTL) -px else px
    }

    companion object {
        internal fun of(
            view: View,
            container: ViewGroup,
        ) = LayoutMetrics(
            containerWidth = container.width,
            containerHeight = container.height,
            density = view.resources.displayMetrics.density,
            isRTL = container.layoutDirection == View.LAYOUT_DIRECTION_RTL,
        )
    }
}
