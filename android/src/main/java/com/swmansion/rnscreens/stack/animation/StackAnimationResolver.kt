package com.swmansion.rnscreens.stack.animation

import com.swmansion.rnscreens.stack.animation.engine.Easings
import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.StackAnimationDescriptor
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
        return resolveRow(template, definition.referenceDurationMs, definition.easing, outZPolicy)
    }

    /**
     * Templates are authored in fractions of a reference duration; a row lasts as long as its
     * longest slot, or one reference when it has no tracks at all (`none`).
     */
    private fun resolveRow(
        template: RowTemplate,
        referenceMs: Long,
        easing: Easing,
        outZPolicy: ZPolicy,
    ): RowSpec {
        val inSlot = template.inSlot?.let { resolveSlot(it, referenceMs, easing) }
        val outSlot = template.outSlot?.let { resolveSlot(it, referenceMs, easing) }
        val rowDurationMs =
            maxOf(inSlot?.durationMs ?: 0L, outSlot?.durationMs ?: 0L)
                .takeIf { it > 0L } ?: referenceMs
        return RowSpec(
            inSlot = inSlot ?: SlotSpec.noOp(rowDurationMs),
            outSlot = outSlot ?: SlotSpec.noOp(rowDurationMs),
            outZPolicy = outZPolicy,
        )
    }

    private fun resolveSlot(
        template: SlotTemplate,
        referenceMs: Long,
        easing: Easing,
    ): SlotSpec {
        val tracks =
            template.tracks.map {
                TrackSpec(
                    property = it.property,
                    from = it.from,
                    to = it.to,
                    startMs = referenceMs.scaledBy(it.start),
                    durationMs = referenceMs.scaledBy(it.duration),
                    interpolator = Easings.get(it.easing ?: easing),
                )
            }
        return SlotSpec(tracks, durationMs = tracks.maxOf { it.startMs + it.durationMs })
    }

    private fun Long.scaledBy(fraction: Float): Long = (this * fraction).roundToLong()
}
