package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

internal enum class Edge {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    ;

    fun opposite(): Edge =
        when (this) {
            LEFT -> RIGHT
            RIGHT -> LEFT
            TOP -> BOTTOM
            BOTTOM -> TOP
        }
}

internal object DirectionalMotion {
    /**
     * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives
     * at rest along it, a disappearing view departs from rest along it (exiting through the
     * opposite edge).
     */
    fun slideFrom(
        edge: Edge,
        distance: Value,
        appearing: Boolean,
    ): SlotTemplate {
        val property =
            when (edge) {
                Edge.LEFT, Edge.RIGHT -> TrackProperty.TRANSLATE_X
                Edge.TOP, Edge.BOTTOM -> TrackProperty.TRANSLATE_Y
            }
        val towardEdge =
            when (edge) {
                Edge.RIGHT, Edge.BOTTOM -> distance
                Edge.LEFT, Edge.TOP -> distance.negated()
            }
        val rest = Value.Percent(0f)
        val track =
            if (appearing) {
                TrackTemplate(property, from = towardEdge, to = rest)
            } else {
                TrackTemplate(property, from = rest, to = towardEdge.negated())
            }
        return SlotTemplate(listOf(track))
    }
}
