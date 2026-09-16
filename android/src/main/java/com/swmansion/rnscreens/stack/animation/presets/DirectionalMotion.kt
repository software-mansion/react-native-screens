package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

internal enum class Edge {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    START,
    END,
    ;

    fun opposite(): Edge =
        when (this) {
            LEFT -> RIGHT
            RIGHT -> LEFT
            TOP -> BOTTOM
            BOTTOM -> TOP
            START -> END
            END -> START
        }
}

internal object DirectionalMotion {
    /**
     * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives
     * at rest along it, a disappearing view departs from rest along it (exiting through the
     * opposite edge). Logical edges are authored as their left-to-right counterparts and mirrored
     * at run time.
     */
    fun translateFrom(
        edge: Edge,
        distance: Value,
        appearing: Boolean,
    ): TrackTemplate {
        val property =
            when (edge) {
                Edge.LEFT, Edge.RIGHT, Edge.START, Edge.END -> TrackProperty.TRANSLATE_X
                Edge.TOP, Edge.BOTTOM -> TrackProperty.TRANSLATE_Y
            }
        val towardEdge =
            when (edge) {
                Edge.RIGHT, Edge.BOTTOM, Edge.END -> distance
                Edge.LEFT, Edge.TOP, Edge.START -> distance.negated()
            }
        val rest = Value.Percent(0f)
        val mirrorInRtl = edge == Edge.START || edge == Edge.END
        return if (appearing) {
            TrackTemplate(property, from = towardEdge, to = rest, mirrorInRtl = mirrorInRtl)
        } else {
            TrackTemplate(property, from = rest, to = towardEdge.negated(), mirrorInRtl = mirrorInRtl)
        }
    }

    fun slideFrom(
        edge: Edge,
        distance: Value,
        appearing: Boolean,
    ): SlotTemplate = SlotTemplate(listOf(translateFrom(edge, distance, appearing)))
}
