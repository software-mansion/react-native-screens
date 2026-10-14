package com.swmansion.rnscreens.core.containers.stack.animation.presets

import android.os.Build
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track

/**
 * The platform-style transition for the running API level, transcribed from the legacy
 * `rns_default_*` XMLs: a cross-zoom below API 33, the Android 13 horizontal slide from API 33 on.
 */
internal object DefaultPreset {
    // `res/base/anim/rns_default_{enter,exit}_{in,out}.xml`: a recreation of the pre-13 AOSP
    // activity transition, 200 ms with a 100 ms fade.
    private const val CROSS_ZOOM_DURATION_MS = 200L
    private const val CROSS_ZOOM_FADE_DURATION_MS = 100L
    private const val SCALE_ZOOMED_IN = 1.15f
    private const val SCALE_ZOOMED_OUT = 0.85f
    private const val OPACITY_COVERED = 0.4f

    // `res/v33/anim-v33/rns_default_*.xml`: the Android 13 activity transition, 450 ms with an
    // 83 ms quick fade; its `<extend>` 10 % is dropped (research note 02 §8).
    private const val SLIDE_DURATION_MS = 450L
    private const val SLIDE_FADE_DURATION_MS = 83L
    private val DISTANCE_SLIDE = Length.Percent(0.1f)

    // `accelerate_decelerate` is the default interpolator of a view `Animation` whose XML names none.
    private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

    // The XML's `fast_out_extra_slow_in` is the M3 `emphasized` curve (research note 06 §5.1).
    private val EASING_EMPHASIZED = Easing.Named(EasingName.EMPHASIZED)
    private val EASING_LINEAR = Easing.Named(EasingName.LINEAR)

    internal val definition: PresetDefinition =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) slide() else crossZoom()

    private fun crossZoom() =
        PresetDefinition(
            push =
                pushTimeline(
                    enter = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStartMs = 100L, scaleFrom = SCALE_ZOOMED_OUT, scaleTo = 1f),
                    exit =
                        zoom(
                            opacityFrom = 1f,
                            opacityTo = OPACITY_COVERED,
                            opacityStartMs = 100L,
                            scaleFrom = 1f,
                            scaleTo = SCALE_ZOOMED_IN,
                        ),
                ),
            pop =
                popTimeline(
                    enter = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStartMs = 50L, scaleFrom = SCALE_ZOOMED_IN, scaleTo = 1f),
                    exit = zoom(opacityFrom = 1f, opacityTo = 0f, opacityStartMs = 50L, scaleFrom = 1f, scaleTo = SCALE_ZOOMED_OUT),
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
            Tracks.opacity(opacityFrom, opacityTo, CROSS_ZOOM_FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE, startMs = opacityStartMs),
            Tracks.scale(scaleFrom, scaleTo, CROSS_ZOOM_DURATION_MS, EASING_ACCELERATE_DECELERATE),
        )

    private fun slide() =
        PresetDefinition(
            push =
                pushTimeline(
                    enter =
                        listOf(
                            quickFade(from = 0f, to = 1f, startMs = 50L),
                            slide(Edge.END, isAppearing = true),
                        ),
                    exit = listOf(slide(Edge.END, isAppearing = false)),
                ),
            pop =
                popTimeline(
                    enter = listOf(slide(Edge.START, isAppearing = true)),
                    exit =
                        listOf(
                            quickFade(from = 1f, to = 0f, startMs = 35L),
                            slide(Edge.START, isAppearing = false),
                        ),
                ),
        )

    private fun slide(
        edge: Edge,
        isAppearing: Boolean,
    ) = Tracks.translateFrom(edge, DISTANCE_SLIDE, isAppearing, SLIDE_DURATION_MS, EASING_EMPHASIZED)

    private fun quickFade(
        from: Float,
        to: Float,
        startMs: Long,
    ) = Tracks.opacity(from, to, SLIDE_FADE_DURATION_MS, EASING_LINEAR, startMs = startMs)
}
