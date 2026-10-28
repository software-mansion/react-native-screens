package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.MotionConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.TrackConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.TrackTimingConfig
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Axis
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Timing
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ViewProperty

// A track without an `easing` plays linearly: the one curve that means the same on every
// platform, and what a predictive back gesture plays anyway.
private val DEFAULT_EASING = Easing.Named(EasingName.LINEAR)

// A scrim at rest is absent.
private const val DIM_REST_ALPHA = 0f

/**
 * The tracks of a motion written as tracks, endpoints completed with the rest values; a track
 * with both omitted holds the rest value. The horizontal axis is physical: a raw `translateX`
 * never mirrors in a right-to-left container.
 */
internal fun customMotionTracks(config: MotionConfig.Custom): List<Track> =
    buildList {
        config.translateX?.let { add(translateTrack(it, Axis.X)) }
        config.translateY?.let { add(translateTrack(it, Axis.Y)) }
        config.opacity?.let { add(propertyTrack(it, ViewProperty.OPACITY)) }
        addAll(scaleTracks(config.scale, config.scaleX, config.scaleY))
        config.rotate?.let { add(propertyTrack(it, ViewProperty.ROTATE)) }
        config.dim?.let { add(dimTrack(it)) }
    }

/**
 * `scaleX` / `scaleY` replace the matching axis of `scale`; an axis they leave out keeps it.
 */
private fun scaleTracks(
    scale: TrackConfig.Scalar?,
    scaleX: TrackConfig.Scalar?,
    scaleY: TrackConfig.Scalar?,
): List<Track> =
    when {
        scale == null ->
            listOfNotNull(
                scaleX?.let { propertyTrack(it, ViewProperty.SCALE_X) },
                scaleY?.let { propertyTrack(it, ViewProperty.SCALE_Y) },
            )
        scaleX == null && scaleY == null -> listOf(propertyTrack(scale, ViewProperty.SCALE))
        else -> listOf(propertyTrack(scaleX ?: scale, ViewProperty.SCALE_X), propertyTrack(scaleY ?: scale, ViewProperty.SCALE_Y))
    }

private fun translateTrack(
    config: TrackConfig.Translate,
    axis: Axis,
): Track = Track.Translate(axis, config.from ?: Length.ZERO, config.to ?: Length.ZERO, timingOf(config.timing))

private fun propertyTrack(
    config: TrackConfig.Numeric,
    property: ViewProperty,
): Track = Track.Property(property, config.from ?: property.restValue, config.to ?: property.restValue, timingOf(config.timing))

private fun dimTrack(config: TrackConfig.Dim): Track =
    Track.Dim(config.color ?: DIM_COLOR, config.from ?: DIM_REST_ALPHA, config.to ?: DIM_REST_ALPHA, timingOf(config.timing))

private fun timingOf(config: TrackTimingConfig): Timing =
    Timing(startMs = config.delayMs, durationMs = config.durationMs, easing = config.easing ?: DEFAULT_EASING)
