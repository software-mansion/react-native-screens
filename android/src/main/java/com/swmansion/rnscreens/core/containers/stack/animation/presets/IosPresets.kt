package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline

// Every value below is taken from the legacy implementation's
// `res/base/anim/rns_ios_from_{right,left}_{foreground,background}_{open,close}.xml` animations,
// except the dim, which the legacy Android implementation did not have.

// `@android:integer/config_shortAnimTime` (200 ms); `accelerate_decelerate` on the foreground,
// no interpolator (the same curve, the default of a view `Animation`) on the background.
private const val DURATION_MS = 200L
private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

// Foreground `android:fromXDelta="100%"`: the full width.
private val DISTANCE_FULL = Length.Percent(1f)

// Background `android:toXDelta="-30%"`; the legacy iOS `RNSScreenStackAnimator` uses the same
// `containerWidth * 0.3` in its simple push and slide-from-left animations.
private val DISTANCE_PARALLAX = Length.Percent(0.3f)

// Not in the legacy Android implementation; taken from the legacy iOS `RNSScreenStackAnimator`'s
// `RNSShadowViewMaxAlpha` (0.1).
private const val DIM_ALPHA = 0.1f

/**
 * The iOS look: the pushed or popped screen travels the full width along [edge]'s vector over a
 * background that moves 30 % with it and is darkened while covered.
 */
internal fun iosFromTransition(
    edge: Edge,
    kind: StackTransitionKind,
): TransitionTimeline =
    when (kind) {
        StackTransitionKind.PUSH ->
            TransitionTimeline.of(
                kind,
                enter = listOf(travel(edge, DISTANCE_FULL, isAppearing = true)),
                exit =
                    listOf(
                        travel(edge, DISTANCE_PARALLAX, isAppearing = false),
                        dimTrack(0f, DIM_ALPHA, DURATION_MS, EASING_ACCELERATE_DECELERATE),
                    ),
            )
        StackTransitionKind.POP ->
            TransitionTimeline.of(
                kind,
                enter =
                    listOf(
                        travel(edge, DISTANCE_PARALLAX, isAppearing = true),
                        dimTrack(DIM_ALPHA, 0f, DURATION_MS, EASING_ACCELERATE_DECELERATE),
                    ),
                exit = listOf(travel(edge, DISTANCE_FULL, isAppearing = false)),
            )
    }

private fun travel(
    edge: Edge,
    distance: Length,
    isAppearing: Boolean,
) = translationTrack(edge, distance, isAppearing, DURATION_MS, EASING_ACCELERATE_DECELERATE)
