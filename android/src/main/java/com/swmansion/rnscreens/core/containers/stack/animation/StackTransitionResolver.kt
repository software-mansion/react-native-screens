package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.engine.SpecTransition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.animation.model.SlotRole
import com.swmansion.rnscreens.core.containers.stack.animation.spec.RowSpec
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * Pure: picks the transition a fragment plays in a slot from the container's note about the
 * executing operation and the screens' configs.
 *
 * Only one bit of the slot is used, whether the reader's view is appearing or disappearing,
 * which FragmentManager guarantees by construction (an appearing slot is read only for a
 * fragment whose final state is visible). Its push / pop classification is never consulted.
 */
internal object StackTransitionResolver {
    internal fun resolve(
        reader: StackScreenFragment,
        slot: TransitionSlot,
        context: StackTransitionContext?,
        screenAbove: (StackScreenFragment) -> StackScreenFragment?,
    ): SpecTransition? {
        val isAppearing = slot.role == SlotRole.IN
        val row: RowSpec =
            when {
                // A batch of ours is executing and the reader plays its role in it.
                context != null && !isAppearing && reader === context.outgoing -> rowOf(context)
                context != null && isAppearing && reader === context.incoming -> rowOf(context)
                // Otherwise FragmentManager started a pop by itself (predictive back at gesture
                // start): the popped screen plays its own pop row ...
                !isAppearing -> StackAnimationResolver.popRow(reader.item)
                // ... and the revealed screen plays the row of the screen above it. Nothing
                // above means the first screen, which never animates.
                else -> screenAbove(reader)?.let { StackAnimationResolver.popRow(it.item) } ?: return null
            }
        val side = if (isAppearing) row.inSlot else row.outSlot
        return SpecTransition(side, slot, row.outZPolicy)
    }

    private fun rowOf(context: StackTransitionContext): RowSpec =
        when (context.kind) {
            StackTransitionKind.PUSH -> StackAnimationResolver.pushRow(context.incoming.item)
            StackTransitionKind.POP -> StackAnimationResolver.popRow(context.outgoing.item)
            // Fixed to the outgoing screen's pop row until the `replaceAnimation` PR.
            StackTransitionKind.REPLACE ->
                StackAnimationResolver.replaceRow(context.incoming.item, context.outgoing.item)
        }
}
