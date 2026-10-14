package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

internal object SlidePresets {
    // Legacy `config_mediumAnimTime`.
    private const val DURATION_MS = 400L
    private val EASING = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val FULL = Value.Percent(1f)

    fun slideFrom(edge: Edge): PresetDefinition =
        when (edge) {
            Edge.LEFT, Edge.RIGHT, Edge.START, Edge.END -> conveyor(edge)
            Edge.TOP, Edge.BOTTOM -> oneSided(edge)
        }

    // Both screens travel together; the pop row is the same motion from the opposite edge.
    private fun conveyor(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = DURATION_MS,
            push = conveyorRow(edge),
            pop = conveyorRow(edge.opposite()),
        )

    private fun conveyorRow(edge: Edge) =
        AuthoredRow(
            inSlot = slide(edge, SlotRole.IN),
            outSlot = slide(edge, SlotRole.OUT),
        )

    // Only the moving screen travels; the covered / revealed screen stays put (legacy parity).
    private fun oneSided(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = DURATION_MS,
            push = AuthoredRow(inSlot = slide(edge, SlotRole.IN), outSlot = null),
            pop = AuthoredRow(inSlot = null, outSlot = slide(edge.opposite(), SlotRole.OUT)),
        )

    private fun slide(
        edge: Edge,
        role: SlotRole,
    ) = SlotSpec.of(Tracks.translateFrom(edge, FULL, role, DURATION_MS, EASING))
}
