package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

internal object FadePresets {
    private const val FADE_DURATION_MS = 150L
    private const val FADE_FROM_DURATION_MS = 350L
    private const val FADE_FROM_POP_DURATION_MS = 250L

    private val ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val DECELERATE_QUINT = Easing.Named(EasingName.DECELERATE_QUINT)
    private val ACCELERATE_QUINT = Easing.Named(EasingName.ACCELERATE_QUINT)
    private val LINEAR = Easing.Named(EasingName.LINEAR)
    private val TRAVEL = Value.Percent(0.08f)

    fun fade(): PresetDefinition {
        val crossfade =
            AuthoredRow(
                inSlot = SlotSpec.of(Tracks.opacity(0f, 1f, FADE_DURATION_MS, ACCELERATE_DECELERATE)),
                outSlot = SlotSpec.of(Tracks.opacity(1f, 0f, FADE_DURATION_MS, ACCELERATE_DECELERATE)),
            )
        return PresetDefinition(referenceDurationMs = FADE_DURATION_MS, push = crossfade, pop = crossfade)
    }

    // Legacy port of the Nougat activity transition: the moving screen fades while travelling
    // a short distance, the other screen stays put, and the pop row is shorter (250 vs 350 ms).
    fun fadeFrom(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = FADE_FROM_DURATION_MS,
            push =
                AuthoredRow(
                    inSlot =
                        SlotSpec.of(
                            Tracks.opacity(0f, 1f, durationMs = 210L, DECELERATE_QUINT),
                            Tracks.translateFrom(edge, TRAVEL, SlotRole.IN, FADE_FROM_DURATION_MS, DECELERATE_QUINT),
                        ),
                    outSlot = null,
                ),
            pop =
                AuthoredRow(
                    inSlot = null,
                    outSlot =
                        SlotSpec.of(
                            Tracks.opacity(1f, 0f, durationMs = 150L, LINEAR, startMs = 100L),
                            Tracks.translateFrom(
                                edge.opposite(),
                                TRAVEL,
                                SlotRole.OUT,
                                FADE_FROM_POP_DURATION_MS,
                                ACCELERATE_QUINT,
                            ),
                        ),
                ),
        )
}
