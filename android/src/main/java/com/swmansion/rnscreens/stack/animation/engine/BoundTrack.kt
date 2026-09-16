package com.swmansion.rnscreens.stack.animation.engine

import android.content.Context
import android.view.View
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.spec.TrackSpec

/**
 * A [TrackSpec] bound to one view's pixel space: endpoints and interpolator are materialized
 * once per animator, then evaluated per frame as a function of the slot's master time.
 */
internal class BoundTrack(
    private val spec: TrackSpec,
    metrics: LayoutMetrics,
    context: Context,
) {
    private val sign = if (spec.mirrorInRtl && metrics.isRTL) -1f else 1f
    private val from = sign * spec.from.resolve(spec.property, metrics)
    private val to = sign * spec.to.resolve(spec.property, metrics)
    private val interpolator = spec.easing.toInterpolator(context)

    fun applyTo(
        view: View,
        timeMs: Float,
    ) {
        val value = from + (to - from) * interpolator.getInterpolation(spec.fractionAt(timeMs))
        when (spec.property) {
            TrackProperty.TRANSLATE_X -> view.translationX = value
            TrackProperty.TRANSLATE_Y -> view.translationY = value
            TrackProperty.OPACITY -> view.alpha = value
            TrackProperty.SCALE -> {
                view.scaleX = value
                view.scaleY = value
            }
        }
    }
}
