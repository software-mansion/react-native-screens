package com.swmansion.rnscreens.stack.animation

import com.swmansion.rnscreens.stack.animation.engine.Easings
import com.swmansion.rnscreens.stack.animation.model.StackAnimationDescriptor
import com.swmansion.rnscreens.stack.animation.presets.PresetDefinition
import com.swmansion.rnscreens.stack.animation.presets.PresetTable
import com.swmansion.rnscreens.stack.animation.presets.RowTemplate
import com.swmansion.rnscreens.stack.animation.presets.SlotTemplate
import com.swmansion.rnscreens.stack.animation.spec.RowSpec
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec
import com.swmansion.rnscreens.stack.animation.spec.TrackSpec
import com.swmansion.rnscreens.stack.animation.spec.ZPolicy
import com.swmansion.rnscreens.stack.screen.StackScreen
import kotlin.math.roundToLong

/**
 * Resolves a screen's animation descriptor into the row that plays for an operation.
 * Pure: the output is a value with absolute timings, safe to recompute on every batch.
 */
internal object StackAnimationResolver {
    private enum class Row {
        PUSH,
        POP,
    }

    // The governing screen: push -> incoming, pop -> outgoing.
    fun pushRow(incoming: StackScreen): RowSpec = resolveRow(incoming.animation, Row.PUSH, ZPolicy.UNDER)

    fun popRow(outgoing: StackScreen): RowSpec = resolveRow(outgoing.animation, Row.POP, ZPolicy.OVER)

    // FragmentManager classifies a replace batch as a push; the outgoing screen's pop row is
    // played in the push slots, on top of the incoming screen.
    fun replaceRow(
        incoming: StackScreen,
        outgoing: StackScreen,
    ): RowSpec = popRow(outgoing)

    private fun resolveRow(
        descriptor: StackAnimationDescriptor,
        row: Row,
        outZPolicy: ZPolicy,
    ): RowSpec {
        val definition =
            when (descriptor) {
                is StackAnimationDescriptor.Preset -> PresetTable.get(descriptor.name)
            }
        val template =
            when (row) {
                Row.PUSH -> definition.push
                Row.POP -> definition.pop
            }
        return resolveRow(definition, template, outZPolicy)
    }

    private fun resolveRow(
        definition: PresetDefinition,
        template: RowTemplate,
        outZPolicy: ZPolicy,
    ): RowSpec {
        val inSlot = template.inSlot?.let { resolveSlot(definition, it) }
        val outSlot = template.outSlot?.let { resolveSlot(definition, it) }
        val rowDurationMs =
            maxOf(
                definition.referenceDurationMs.scaledBy(template.duration),
                inSlot?.durationMs ?: 0L,
                outSlot?.durationMs ?: 0L,
            )
        return RowSpec(
            inSlot = inSlot ?: SlotSpec.noOp(rowDurationMs),
            outSlot = outSlot ?: SlotSpec.noOp(rowDurationMs),
            outZPolicy = outZPolicy,
        )
    }

    private fun resolveSlot(
        definition: PresetDefinition,
        template: SlotTemplate,
    ): SlotSpec {
        val tracks =
            template.tracks.map {
                TrackSpec(
                    property = it.property,
                    from = it.from,
                    to = it.to,
                    startMs = definition.referenceDurationMs.scaledBy(it.start),
                    durationMs = definition.referenceDurationMs.scaledBy(it.duration),
                    interpolator = Easings.get(it.easing ?: definition.easing),
                )
            }
        return SlotSpec(tracks, durationMs = tracks.maxOf { it.startMs + it.durationMs })
    }

    private fun Long.scaledBy(fraction: Float): Long = (this * fraction).roundToLong()
}
