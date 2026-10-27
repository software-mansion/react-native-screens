package com.swmansion.rnscreens.core.containers.stack.animation.presets

import android.os.Build
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.AnimationTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline

// Every value below is taken from the legacy implementation's `rns_default_*.xml` animations.
// Below API 33 those are `res/base/anim/rns_default_{enter,exit}_{in,out}.xml`, a recreation of
// the pre-13 AOSP activity transition (a cross-zoom); from API 33 on they are
// `res/v33/anim-v33/rns_default_{enter,exit}_{in,out}.xml`, the Android 13 activity transition
// (a horizontal slide).

// Cross-zoom: every `<scale>` lasts 200 ms, every `<alpha>` 100 ms.
private const val CROSS_ZOOM_DURATION_MS = 200L
private const val CROSS_ZOOM_FADE_DURATION_MS = 100L

// Cross-zoom `<alpha android:startOffset>`: 100 in `rns_default_enter_{in,out}.xml` (push), 50 in
// `rns_default_exit_{in,out}.xml` (pop).
private const val CROSS_ZOOM_PUSH_FADE_START_MS = 100L
private const val CROSS_ZOOM_POP_FADE_START_MS = 50L

// Cross-zoom `<scale>` endpoints: the entering screen grows from 0.85, the covered screen grows
// to 1.15 (`rns_default_enter_{in,out}.xml`); the pop reverses both.
private const val SCALE_ZOOMED_IN = 1.15f
private const val SCALE_ZOOMED_OUT = 0.85f

// Cross-zoom `<alpha android:toAlpha>` of the covered screen (`rns_default_enter_out.xml`).
private const val OPACITY_COVERED = 0.4f

// Slide: `<translate>` 450 ms, `<alpha>` 83 ms (`anim-v33/rns_default_*.xml`). The XMLs' `<extend>`
// of 10 % is dropped: it stretches the view's edges past its bounds, which a view transition
// cannot express.
private const val SLIDE_DURATION_MS = 450L
private const val SLIDE_FADE_DURATION_MS = 83L

// Slide `<alpha android:startOffset>`: 50 in `anim-v33/rns_default_enter_in.xml` (push), 35 in
// `anim-v33/rns_default_exit_out.xml` (pop).
private const val SLIDE_PUSH_FADE_START_MS = 50L
private const val SLIDE_POP_FADE_START_MS = 35L

// Slide `<translate android:fromXDelta="10%">` (`anim-v33/rns_default_enter_in.xml`).
private val DISTANCE_SLIDE = Length.Percent(0.1f)

// The cross-zoom XMLs name `accelerate_decelerate` or no interpolator, which is the same curve:
// it is the default of a view `Animation`.
private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

// The slide XMLs' `fast_out_extra_slow_in` is the same curve as Material 3's `emphasized`
// (identical path data); their `<alpha>` uses `linear`.
private val EASING_EMPHASIZED = Easing.Named(EasingName.EMPHASIZED)
private val EASING_LINEAR = Easing.Named(EasingName.LINEAR)

/**
 * The platform-style transition for the running API level: a cross-zoom below API 33, the
 * Android 13 horizontal slide from API 33 on.
 */
internal fun defaultPreset(): AnimationTimeline = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) slide() else crossZoom()

private fun crossZoom() =
    AnimationTimeline(
        push =
            TransitionTimeline.of(
                StackTransitionKind.PUSH,
                enter =
                    zoom(
                        opacityFrom = 0f,
                        opacityTo = 1f,
                        opacityStartMs = CROSS_ZOOM_PUSH_FADE_START_MS,
                        scaleFrom = SCALE_ZOOMED_OUT,
                        scaleTo = 1f,
                    ),
                exit =
                    zoom(
                        opacityFrom = 1f,
                        opacityTo = OPACITY_COVERED,
                        opacityStartMs = CROSS_ZOOM_PUSH_FADE_START_MS,
                        scaleFrom = 1f,
                        scaleTo = SCALE_ZOOMED_IN,
                    ),
            ),
        pop =
            TransitionTimeline.of(
                StackTransitionKind.POP,
                enter =
                    zoom(
                        opacityFrom = 0f,
                        opacityTo = 1f,
                        opacityStartMs = CROSS_ZOOM_POP_FADE_START_MS,
                        scaleFrom = SCALE_ZOOMED_IN,
                        scaleTo = 1f,
                    ),
                exit =
                    zoom(
                        opacityFrom = 1f,
                        opacityTo = 0f,
                        opacityStartMs = CROSS_ZOOM_POP_FADE_START_MS,
                        scaleFrom = 1f,
                        scaleTo = SCALE_ZOOMED_OUT,
                    ),
            ),
    )

private fun zoom(
    opacityFrom: Float,
    opacityTo: Float,
    opacityStartMs: Long,
    scaleFrom: Float,
    scaleTo: Float,
): List<Track> =
    listOf(
        opacityTrack(opacityFrom, opacityTo, CROSS_ZOOM_FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE, startMs = opacityStartMs),
        scaleTrack(scaleFrom, scaleTo, CROSS_ZOOM_DURATION_MS, EASING_ACCELERATE_DECELERATE),
    )

private fun slide() =
    AnimationTimeline(
        push =
            TransitionTimeline.of(
                StackTransitionKind.PUSH,
                enter =
                    listOf(
                        quickFade(from = 0f, to = 1f, startMs = SLIDE_PUSH_FADE_START_MS),
                        slide(Edge.END, isAppearing = true),
                    ),
                exit = listOf(slide(Edge.END, isAppearing = false)),
            ),
        pop =
            TransitionTimeline.of(
                StackTransitionKind.POP,
                enter = listOf(slide(Edge.START, isAppearing = true)),
                exit =
                    listOf(
                        quickFade(from = 1f, to = 0f, startMs = SLIDE_POP_FADE_START_MS),
                        slide(Edge.START, isAppearing = false),
                    ),
            ),
    )

private fun slide(
    edge: Edge,
    isAppearing: Boolean,
) = translationTrack(edge, DISTANCE_SLIDE, isAppearing, SLIDE_DURATION_MS, EASING_EMPHASIZED)

private fun quickFade(
    from: Float,
    to: Float,
    startMs: Long,
) = opacityTrack(from, to, SLIDE_FADE_DURATION_MS, EASING_LINEAR, startMs = startMs)
