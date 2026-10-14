package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.view.View
import android.view.ViewGroup
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis

/**
 * The pixel space one screen animates in; the only place density and layout direction are read.
 */
internal data class LayoutMetrics(
    val containerWidth: Int,
    val containerHeight: Int,
    val density: Float,
    val isRTL: Boolean,
) {
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

/**
 * Pixels along [axis]; a logical X mirrors in a right-to-left container.
 */
internal fun Length.toPx(
    axis: Axis,
    metrics: LayoutMetrics,
): Float {
    val px =
        when (this) {
            is Length.Dp -> value * metrics.density
            is Length.Percent ->
                fraction *
                    when (axis) {
                        Axis.X, Axis.LOGICAL_X -> metrics.containerWidth
                        Axis.Y -> metrics.containerHeight
                    }
        }
    return if (axis == Axis.LOGICAL_X && metrics.isRTL) -px else px
}
