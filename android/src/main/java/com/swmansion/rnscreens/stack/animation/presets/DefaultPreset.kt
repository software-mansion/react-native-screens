package com.swmansion.rnscreens.stack.animation.presets

import android.os.Build
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

/**
 * The platform-style transition for the running API level, transcribed from the legacy
 * `rns_default_*` XMLs: a cross-zoom below API 33, the Android 13 horizontal slide from API 33 on.
 */
internal object DefaultPreset {
    private const val CROSS_ZOOM_DURATION_MS = 200L
    private const val SLIDE_DURATION_MS = 450L

    private val ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val EMPHASIZED = Easing.Named(EasingName.EMPHASIZED)
    private val LINEAR = Easing.Named(EasingName.LINEAR)

    val definition: PresetDefinition =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) slide() else crossZoom()

    private fun crossZoom() =
        PresetDefinition(
            referenceDurationMs = CROSS_ZOOM_DURATION_MS,
            push =
                AuthoredRow(
                    inSlot = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStartMs = 100L, scaleFrom = 0.85f, scaleTo = 1f),
                    outSlot = zoom(opacityFrom = 1f, opacityTo = 0.4f, opacityStartMs = 100L, scaleFrom = 1f, scaleTo = 1.15f),
                ),
            pop =
                AuthoredRow(
                    inSlot = zoom(opacityFrom = 0f, opacityTo = 1f, opacityStartMs = 50L, scaleFrom = 1.15f, scaleTo = 1f),
                    outSlot = zoom(opacityFrom = 1f, opacityTo = 0f, opacityStartMs = 50L, scaleFrom = 1f, scaleTo = 0.85f),
                ),
        )

    private fun zoom(
        opacityFrom: Float,
        opacityTo: Float,
        opacityStartMs: Long,
        scaleFrom: Float,
        scaleTo: Float,
    ) = SlotSpec.of(
        Tracks.opacity(opacityFrom, opacityTo, durationMs = 100L, ACCELERATE_DECELERATE, startMs = opacityStartMs),
        Tracks.scale(scaleFrom, scaleTo, CROSS_ZOOM_DURATION_MS, ACCELERATE_DECELERATE),
    )

    private fun slide(): PresetDefinition {
        val travel = Value.Percent(0.1f)
        return PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            push =
                AuthoredRow(
                    inSlot =
                        SlotSpec.of(
                            quickFade(from = 0f, to = 1f, startMs = 50L),
                            Tracks.translateFrom(Edge.END, travel, SlotRole.IN, SLIDE_DURATION_MS, EMPHASIZED),
                        ),
                    outSlot = SlotSpec.of(Tracks.translateFrom(Edge.END, travel, SlotRole.OUT, SLIDE_DURATION_MS, EMPHASIZED)),
                ),
            pop =
                AuthoredRow(
                    inSlot = SlotSpec.of(Tracks.translateFrom(Edge.START, travel, SlotRole.IN, SLIDE_DURATION_MS, EMPHASIZED)),
                    outSlot =
                        SlotSpec.of(
                            quickFade(from = 1f, to = 0f, startMs = 35L),
                            Tracks.translateFrom(Edge.START, travel, SlotRole.OUT, SLIDE_DURATION_MS, EMPHASIZED),
                        ),
                ),
        )
    }

    private fun quickFade(
        from: Float,
        to: Float,
        startMs: Long,
    ) = Tracks.opacity(from, to, durationMs = 83L, LINEAR, startMs = startMs)
}
