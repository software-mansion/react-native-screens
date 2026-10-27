package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track

// Every value below is taken from the legacy implementation's
// `res/base/anim/rns_slide_{in_from,out_to}_{right,left,bottom}.xml` animations.

// `@android:integer/config_mediumAnimTime` (400 ms), no interpolator (`accelerate_decelerate`,
// the default of a view `Animation`). Equal to the M3 token `md.sys.motion.duration.medium4`;
// kept for v4 parity, not derived from it.
private const val DURATION_MS = 400L
private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

// `android:fromXDelta="100%"` / `android:fromYDelta="100%"`: the full width or height of the
// container.
private val DISTANCE_FULL = Length.Percent(1f)

/**
 * One screen sliding along [edge]'s vector over the full width or height, or over [distance] when
 * given.
 */
internal fun slideTracks(
    edge: Edge,
    distance: Length?,
    isAppearing: Boolean,
): List<Track> = listOf(translationTrack(edge, distance ?: DISTANCE_FULL, isAppearing, DURATION_MS, EASING_ACCELERATE_DECELERATE))
