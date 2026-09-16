package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.model.RowKind
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationDescriptor
import com.swmansion.rnscreens.core.containers.stack.animation.presets.Presets
import com.swmansion.rnscreens.core.containers.stack.animation.spec.RowSpec
import com.swmansion.rnscreens.core.containers.stack.animation.spec.ZPolicy
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem

/**
 * Resolves a screen's animation descriptor into the row that plays for an operation.
 * Pure: the output is a value with absolute timings, safe to recompute on every batch.
 */
internal object StackAnimationResolver {
    // The governing screen: push -> incoming, pop -> outgoing.
    fun pushRow(incoming: StackContainerItem): RowSpec = resolveRow(incoming.animation, RowKind.PUSH, ZPolicy.UNDER)

    fun popRow(outgoing: StackContainerItem): RowSpec = resolveRow(outgoing.animation, RowKind.POP, ZPolicy.OVER)

    // FragmentManager classifies a replace batch as a push; the outgoing screen's pop row is
    // played in the push slots, on top of the incoming screen.
    fun replaceRow(
        incoming: StackContainerItem,
        outgoing: StackContainerItem,
    ): RowSpec = popRow(outgoing)

    private fun resolveRow(
        descriptor: StackAnimationDescriptor,
        kind: RowKind,
        outZPolicy: ZPolicy,
    ): RowSpec {
        val definition =
            when (descriptor) {
                is StackAnimationDescriptor.Preset -> Presets.definition(descriptor.name)
            }
        val row = definition.row(kind)
        return RowSpec.of(row.inSlot, row.outSlot, fallbackDurationMs = definition.referenceDurationMs, outZPolicy)
    }
}
