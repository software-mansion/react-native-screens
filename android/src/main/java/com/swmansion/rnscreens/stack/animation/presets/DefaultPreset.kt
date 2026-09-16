package com.swmansion.rnscreens.stack.animation.presets

import android.os.Build
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

/**
 * The platform-style transition for the running API level, transcribed from the legacy
 * `rns_default_*` XMLs: a cross-zoom below API 33, the Android 13 horizontal slide from API 33 on.
 */
internal object DefaultPreset {
    private const val CROSS_ZOOM_DURATION_MS = 200L
    private const val SLIDE_DURATION_MS = 450L

    val definition: PresetDefinition =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) slide() else crossZoom()

    private fun crossZoom() =
        PresetDefinition(
            referenceDurationMs = CROSS_ZOOM_DURATION_MS,
            easing = Easing.Named(EasingName.ACCELERATE_DECELERATE),
            push =
                RowTemplate(
                    inSlot = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStart = 0.5f, scaleFrom = 0.85f, scaleTo = 1f),
                    outSlot = zoom(opacityFrom = 1f, opacityTo = 0.4f, opacityStart = 0.5f, scaleFrom = 1f, scaleTo = 1.15f),
                ),
            pop =
                RowTemplate(
                    inSlot = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStart = 0.25f, scaleFrom = 1.15f, scaleTo = 1f),
                    outSlot = zoom(opacityFrom = 1f, opacityTo = 0f, opacityStart = 0.25f, scaleFrom = 1f, scaleTo = 0.85f),
                ),
        )

    private fun zoom(
        opacityFrom: Float,
        opacityTo: Float,
        opacityStart: Float,
        scaleFrom: Float,
        scaleTo: Float,
    ) = SlotTemplate(
        listOf(
            TrackTemplate(
                TrackProperty.OPACITY,
                Value.Scalar(opacityFrom),
                Value.Scalar(opacityTo),
                start = opacityStart,
                duration = 0.5f,
            ),
            TrackTemplate(TrackProperty.SCALE, Value.Scalar(scaleFrom), Value.Scalar(scaleTo)),
        ),
    )

    private fun slide(): PresetDefinition {
        val travel = Value.Percent(0.1f)
        return PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            easing = Easing.Named(EasingName.EMPHASIZED),
            push =
                RowTemplate(
                    inSlot =
                        SlotTemplate(
                            listOf(
                                quickFade(from = 0f, to = 1f, startMs = 50),
                                DirectionalMotion.translateFrom(Edge.END, travel, appearing = true),
                            ),
                        ),
                    outSlot = DirectionalMotion.slideFrom(Edge.END, travel, appearing = false),
                ),
            pop =
                RowTemplate(
                    inSlot = DirectionalMotion.slideFrom(Edge.START, travel, appearing = true),
                    outSlot =
                        SlotTemplate(
                            listOf(
                                quickFade(from = 1f, to = 0f, startMs = 35),
                                DirectionalMotion.translateFrom(Edge.START, travel, appearing = false),
                            ),
                        ),
                ),
        )
    }

    private fun quickFade(
        from: Float,
        to: Float,
        startMs: Long,
    ) = TrackTemplate(
        TrackProperty.OPACITY,
        Value.Scalar(from),
        Value.Scalar(to),
        start = startMs.toFloat() / SLIDE_DURATION_MS,
        duration = 83f / SLIDE_DURATION_MS,
        easing = Easing.Named(EasingName.LINEAR),
    )
}
