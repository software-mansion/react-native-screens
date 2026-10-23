package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

import android.view.View
import android.view.ViewGroup
import com.swmansion.rnscreens.core.containers.stack.animation.engine.Interpolators
import com.swmansion.rnscreens.core.containers.stack.animation.engine.LayoutMetrics
import com.swmansion.rnscreens.core.containers.stack.animation.engine.toPx
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ViewProperty

/**
 * The one place the engine decides which target a track drives.
 */
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
                target =
                    when (track.axis) {
                        Axis.X, Axis.LOGICAL_X -> ViewTarget.TRANSLATION_X
                        Axis.Y -> ViewTarget.TRANSLATION_Y
                    },
                from = track.from.toPx(track.axis, metrics),
                to = track.to.toPx(track.axis, metrics),
                timing = track.timing,
                interpolator = interpolator,
            )
        is Track.Property ->
            ViewPropertyBinding(
                view,
                target =
                    when (track.property) {
                        ViewProperty.OPACITY -> ViewTarget.ALPHA
                        ViewProperty.SCALE -> ViewTarget.SCALE
                    },
                from = track.from,
                to = track.to,
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
