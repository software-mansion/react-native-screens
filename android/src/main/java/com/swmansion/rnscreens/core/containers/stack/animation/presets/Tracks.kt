package com.swmansion.rnscreens.core.containers.stack.animation.presets

import android.graphics.Color
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Timing
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ViewProperty

/**
 * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives
 * at rest along it, a disappearing view departs from rest along it (exiting through the
 * opposite edge). Logical edges are written for left-to-right and mirrored by the engine.
 */
internal fun translationTrack(
    edge: Edge,
    distance: Length,
    isAppearing: Boolean,
    durationMs: Long,
    easing: Easing,
    startMs: Long = 0L,
): Track.Translate {
    val axis =
        when (edge) {
            Edge.LEFT, Edge.RIGHT -> Axis.X
            Edge.TOP, Edge.BOTTOM -> Axis.Y
            Edge.START, Edge.END -> Axis.LOGICAL_X
        }
    val towardEdge =
        when (edge) {
            Edge.RIGHT, Edge.BOTTOM, Edge.END -> distance
            Edge.LEFT, Edge.TOP, Edge.START -> distance.negated()
        }
    val (from, to) =
        if (isAppearing) {
            towardEdge to Length.ZERO
        } else {
            Length.ZERO to towardEdge.negated()
        }
    return Track.Translate(axis, from, to, Timing(startMs, durationMs, easing))
}

internal fun opacityTrack(
    from: Float,
    to: Float,
    durationMs: Long,
    easing: Easing,
    startMs: Long = 0L,
): Track.Property = Track.Property(ViewProperty.OPACITY, from, to, Timing(startMs, durationMs, easing))

internal fun scaleTrack(
    from: Float,
    to: Float,
    durationMs: Long,
    easing: Easing,
    startMs: Long = 0L,
): Track.Property = Track.Property(ViewProperty.SCALE, from, to, Timing(startMs, durationMs, easing))

internal fun dimTrack(
    from: Float,
    to: Float,
    durationMs: Long,
    easing: Easing,
    startMs: Long = 0L,
    color: Int = Color.BLACK,
): Track.Dim = Track.Dim(color, from, to, Timing(startMs, durationMs, easing))
