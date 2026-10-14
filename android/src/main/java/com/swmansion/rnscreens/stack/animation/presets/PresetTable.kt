package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.PresetName
import com.swmansion.rnscreens.stack.animation.model.Value
import java.util.EnumMap

internal object PresetTable {
    // Legacy `config_mediumAnimTime`.
    private const val SLIDE_DURATION_MS = 400L

    // Non-zero so that a predictive back gesture scrubs the pop instead of completing it at
    // gesture start, which destroys the fragment before FragmentManager commits the pop.
    private const val NONE_DURATION_MS = 20L

    private val SLIDE_EASING = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val FULL = Value.Percent(1f)

    private val definitions: Map<PresetName, PresetDefinition> =
        PresetName.values().associateWithTo(EnumMap(PresetName::class.java)) { build(it) }

    internal fun get(name: PresetName): PresetDefinition = definitions.getValue(name)

    private fun build(name: PresetName): PresetDefinition =
        when (name) {
            PresetName.SLIDE_FROM_RIGHT -> horizontalSlide(Edge.RIGHT)
            PresetName.SLIDE_FROM_LEFT -> horizontalSlide(Edge.LEFT)
            PresetName.SLIDE_FROM_BOTTOM -> verticalSlide(Edge.BOTTOM)
            PresetName.SLIDE_FROM_TOP -> verticalSlide(Edge.TOP)
            PresetName.NONE ->
                PresetDefinition(
                    referenceDurationMs = NONE_DURATION_MS,
                    easing = SLIDE_EASING,
                    push = RowTemplate(inSlot = null, outSlot = null),
                    pop = RowTemplate(inSlot = null, outSlot = null),
                )
        }

    // Both screens travel together (a conveyor); the pop row is the same motion from the
    // opposite edge.
    private fun horizontalSlide(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            easing = SLIDE_EASING,
            push = conveyorRow(edge),
            pop = conveyorRow(edge.opposite()),
        )

    private fun conveyorRow(edge: Edge) =
        RowTemplate(
            inSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = true),
            outSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = false),
        )

    // Only the moving screen travels; the covered / revealed screen stays put (legacy parity).
    private fun verticalSlide(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            easing = SLIDE_EASING,
            push =
                RowTemplate(
                    inSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = true),
                    outSlot = null,
                ),
            pop =
                RowTemplate(
                    inSlot = null,
                    outSlot = DirectionalMotion.slideFrom(edge.opposite(), FULL, appearing = false),
                ),
        )
}
