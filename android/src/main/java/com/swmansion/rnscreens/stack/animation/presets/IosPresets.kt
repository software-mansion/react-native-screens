package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

internal object IosPresets {
    // Legacy `config_shortAnimTime`.
    private const val DURATION_MS = 200L
    private const val DIM_ALPHA = 0.1f
    private val EASING = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val FULL = Value.Percent(1f)
    private val PARALLAX = Value.Percent(0.3f)

    // The iOS push look: a full-width foreground over a background that recedes by 30 % and
    // darkens slightly.
    fun iosFrom(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = DURATION_MS,
            push =
                AuthoredRow(
                    inSlot = SlotSpec.of(Tracks.translateFrom(edge, FULL, SlotRole.IN, DURATION_MS, EASING)),
                    outSlot =
                        SlotSpec.of(
                            Tracks.translateFrom(edge, PARALLAX, SlotRole.OUT, DURATION_MS, EASING),
                            dim = Tracks.dim(0f, DIM_ALPHA, DURATION_MS, EASING),
                        ),
                ),
            pop =
                AuthoredRow(
                    inSlot =
                        SlotSpec.of(
                            Tracks.translateFrom(edge.opposite(), PARALLAX, SlotRole.IN, DURATION_MS, EASING),
                            dim = Tracks.dim(DIM_ALPHA, 0f, DURATION_MS, EASING),
                        ),
                    outSlot = SlotSpec.of(Tracks.translateFrom(edge.opposite(), FULL, SlotRole.OUT, DURATION_MS, EASING)),
                ),
        )
}
