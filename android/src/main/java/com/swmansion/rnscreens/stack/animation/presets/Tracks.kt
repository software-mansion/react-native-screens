package com.swmansion.rnscreens.stack.animation.presets

import android.graphics.Color
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.DimSpec
import com.swmansion.rnscreens.stack.animation.spec.TrackSpec

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

/**
 * Track authoring helpers for the preset tables.
 */
internal object Tracks {
    /**
     * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives
     * at rest along it, a disappearing view departs from rest along it (exiting through the
     * opposite edge). Logical edges are authored as their left-to-right counterparts and mirrored
     * at run time.
     */
    fun translateFrom(
        edge: Edge,
        distance: Value,
        role: SlotRole,
        durationMs: Long,
        easing: Easing,
        startMs: Long = 0L,
    ): TrackSpec {
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
        val (from, to) =
            when (role) {
                SlotRole.IN -> towardEdge to rest
                SlotRole.OUT -> rest to towardEdge.negated()
            }
        return TrackSpec(
            property,
            from,
            to,
            startMs,
            durationMs,
            easing,
            mirrorInRtl = edge == Edge.START || edge == Edge.END,
        )
    }

    fun opacity(
        from: Float,
        to: Float,
        durationMs: Long,
        easing: Easing,
        startMs: Long = 0L,
    ) = TrackSpec(TrackProperty.OPACITY, Value.Scalar(from), Value.Scalar(to), startMs, durationMs, easing, mirrorInRtl = false)

    fun scale(
        from: Float,
        to: Float,
        durationMs: Long,
        easing: Easing,
        startMs: Long = 0L,
    ) = TrackSpec(TrackProperty.SCALE, Value.Scalar(from), Value.Scalar(to), startMs, durationMs, easing, mirrorInRtl = false)

    fun dim(
        from: Float,
        to: Float,
        durationMs: Long,
        easing: Easing,
        startMs: Long = 0L,
        color: Int = Color.BLACK,
    ) = DimSpec(color, from, to, startMs, durationMs, easing)
}
