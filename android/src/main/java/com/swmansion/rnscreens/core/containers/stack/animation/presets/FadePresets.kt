package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track

// Every value below is taken from the legacy implementation's `res/base/anim/rns_fade_*.xml`
// animations.

// `rns_fade_in.xml` / `rns_fade_out.xml`: 150 ms ("duration taken from debugging source code"),
// no interpolator.
private const val FADE_DURATION_MS = 150L

// `rns_fade_from_bottom.xml` (AOSP Nougat `activity_open_enter.xml`), paired with
// `rns_no_animation_350.xml` on the covered side: a 350 ms `<translate>`, a 210 ms `<alpha>`,
// both `decelerate_quint`.
private const val RISE_DURATION_MS = 350L
private const val RISE_FADE_DURATION_MS = 210L

// `rns_fade_to_bottom.xml` (AOSP Nougat `activity_close_exit.xml`), paired with
// `rns_no_animation_250.xml` on the revealed side: a 250 ms `accelerate_quint` `<translate>`, a
// linear `<alpha>` over 100-250 ms.
private const val FALL_DURATION_MS = 250L
private const val FALL_FADE_START_MS = 100L
private const val FALL_FADE_DURATION_MS = 150L

// `rns_fade_from_bottom.xml` `<translate android:fromYDelta="8%">`; the legacy iOS
// `RNSScreenStackAnimator` uses the same `0.08 * height` in its fade-from-bottom animation.
private val DISTANCE_RISE: Length = Length.Percent(0.08f)

private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)
private val EASING_DECELERATE_QUINT = Easing.Named(EasingName.DECELERATE_QUINT)
private val EASING_ACCELERATE_QUINT = Easing.Named(EasingName.ACCELERATE_QUINT)
private val EASING_LINEAR = Easing.Named(EasingName.LINEAR)

internal fun fadeTracks(isAppearing: Boolean): List<Track> =
    listOf(
        if (isAppearing) {
            opacityTrack(0f, 1f, FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE)
        } else {
            opacityTrack(1f, 0f, FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE)
        },
    )

/**
 * One screen fading while travelling a short distance along [edge]'s vector: the 350 ms rise when
 * appearing, the 250 ms fall when disappearing, as in the legacy XMLs. A `null` [distance] is the
 * legacy 8 %.
 */
internal fun fadeFromTracks(
    edge: Edge,
    distance: Length?,
    isAppearing: Boolean,
): List<Track> {
    val travel = distance ?: DISTANCE_RISE
    return if (isAppearing) {
        listOf(
            opacityTrack(0f, 1f, RISE_FADE_DURATION_MS, EASING_DECELERATE_QUINT),
            translationTrack(edge, travel, isAppearing = true, RISE_DURATION_MS, EASING_DECELERATE_QUINT),
        )
    } else {
        listOf(
            opacityTrack(1f, 0f, FALL_FADE_DURATION_MS, EASING_LINEAR, startMs = FALL_FADE_START_MS),
            translationTrack(edge, travel, isAppearing = false, FALL_DURATION_MS, EASING_ACCELERATE_QUINT),
        )
    }
}
