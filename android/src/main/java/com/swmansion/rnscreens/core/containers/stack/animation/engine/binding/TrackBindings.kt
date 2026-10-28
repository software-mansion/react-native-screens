package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

import android.view.View
import android.view.ViewGroup
import com.swmansion.rnscreens.core.containers.stack.animation.engine.Interpolators
import com.swmansion.rnscreens.core.containers.stack.animation.engine.LayoutMetrics
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ViewProperty

internal fun bindTrack(
    track: Track,
    view: View,
    metrics: LayoutMetrics,
): TrackBinding {
    val interpolator = Interpolators.of(track.timing.easing, view.context)
    return when (track) {
        is Track.Translate ->
            ViewPropertyBinding(
                view,
                set = translationSetter(track.axis),
                from = metrics.toPx(track.from, track.axis),
                to = metrics.toPx(track.to, track.axis),
                restValue = metrics.toPx(Length.ZERO, track.axis),
                timing = track.timing,
                interpolator = interpolator,
            )
        is Track.Property ->
            ViewPropertyBinding(
                view,
                set = propertySetter(track.property),
                from = track.from,
                to = track.to,
                restValue = track.property.restValue,
                timing = track.timing,
                interpolator = interpolator,
            )
        is Track.Dim ->
            ScrimBinding(
                host = checkNotNull(view as? ViewGroup) { "[RNScreens] A dimmed screen root must be a ViewGroup" },
                color = track.color,
                from = track.from,
                to = track.to,
                timing = track.timing,
                interpolator = interpolator,
            )
    }
}

private fun translationSetter(axis: Axis): View.(Float) -> Unit =
    when (axis) {
        Axis.X, Axis.LOGICAL_X -> View::setTranslationX
        Axis.Y -> View::setTranslationY
    }

private fun propertySetter(property: ViewProperty): View.(Float) -> Unit =
    when (property) {
        ViewProperty.OPACITY -> View::setAlpha
        ViewProperty.SCALE -> { value ->
            scaleX = value
            scaleY = value
        }
        ViewProperty.SCALE_X -> View::setScaleX
        ViewProperty.SCALE_Y -> View::setScaleY
        ViewProperty.ROTATE -> View::setRotation
    }
