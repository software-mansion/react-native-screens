package com.swmansion.rnscreens.stack.animation.engine

import android.view.View
import android.view.ViewGroup
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

/**
 * The pixel space one slot animates in; the only place density and layout direction are read.
 */
internal data class LayoutMetrics(
    val containerWidth: Int,
    val containerHeight: Int,
    val density: Float,
    val isRTL: Boolean,
) {
    companion object {
        fun of(
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

internal fun Value.toPixels(
    property: TrackProperty,
    metrics: LayoutMetrics,
): Float =
    when (this) {
        is Value.Scalar -> value
        is Value.Dp -> value * metrics.density
        is Value.Percent ->
            fraction *
                when (property) {
                    TrackProperty.TRANSLATE_X -> metrics.containerWidth
                    TrackProperty.TRANSLATE_Y -> metrics.containerHeight
                    TrackProperty.OPACITY, TrackProperty.SCALE ->
                        error("[RNScreens] Percent values are only valid on translate tracks")
                }
    }
