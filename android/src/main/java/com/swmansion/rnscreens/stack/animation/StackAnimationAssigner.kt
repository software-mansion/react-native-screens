package com.swmansion.rnscreens.stack.animation

import com.swmansion.rnscreens.stack.animation.engine.SpecTransition
import com.swmansion.rnscreens.stack.animation.spec.Slot
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec
import com.swmansion.rnscreens.stack.animation.spec.ZPolicy
import com.swmansion.rnscreens.stack.screen.StackScreenFragment

/**
 * Writes fragment transition slots ahead of FragmentManager reading them: at batch
 * computation, on a top-screen prop update and after a native pop.
 */
internal object StackAnimationAssigner {
    /**
     * `popped` is ordered top-first, `pushed` bottom-up. Lists are never both empty.
     */
    fun assignBatch(
        previousTop: StackScreenFragment?,
        popped: List<StackScreenFragment>,
        pushed: List<StackScreenFragment>,
        newTop: StackScreenFragment,
        belowNewTop: StackScreenFragment?,
    ) {
        when {
            // The first screen is not a back stack record; nothing animates.
            previousTop == null -> Unit

            popped.isEmpty() -> {
                val row = StackAnimationResolver.pushRow(newTop.stackScreen)
                write(newTop, Slot.ENTER, row.inSlot, ZPolicy.OVER)
                write(previousTop, Slot.EXIT, row.outSlot, row.outZPolicy)
                pushed.dropLast(1).forEach {
                    write(it, Slot.ENTER, SlotSpec.noOp(row.durationMs), ZPolicy.OVER)
                }
            }

            pushed.isEmpty() -> {
                val row = StackAnimationResolver.popRow(previousTop.stackScreen)
                write(previousTop, Slot.RETURN, row.outSlot, row.outZPolicy)
                // After a multi-pop the revealed screen's slot still holds the row of the screen
                // that used to sit directly on it.
                write(newTop, Slot.REENTER, row.inSlot, ZPolicy.UNDER)
                popped.drop(1).forEach {
                    write(it, Slot.RETURN, SlotSpec.noOp(row.durationMs), ZPolicy.OVER)
                }
            }

            else -> {
                val row = StackAnimationResolver.replaceRow(newTop.stackScreen, previousTop.stackScreen)
                write(newTop, Slot.ENTER, row.inSlot, ZPolicy.OVER)
                write(previousTop, Slot.EXIT, row.outSlot, row.outZPolicy)
                belowNewTop?.let {
                    write(it, Slot.EXIT, SlotSpec.noOp(row.durationMs), ZPolicy.UNDER)
                }
            }
        }
        refreshTopPair(newTop, belowNewTop)
    }

    /**
     * Predictive back reads the top pair's return / reenter slots at gesture start without
     * going through the container, so they must hold the top screen's pop row at all times.
     */
    fun refreshTopPair(
        top: StackScreenFragment,
        under: StackScreenFragment?,
    ) {
        if (under == null) return
        val row = StackAnimationResolver.popRow(top.stackScreen)
        write(top, Slot.RETURN, row.outSlot, row.outZPolicy)
        write(under, Slot.REENTER, row.inSlot, ZPolicy.UNDER)
    }

    private fun write(
        fragment: StackScreenFragment,
        slot: Slot,
        spec: SlotSpec,
        zPolicy: ZPolicy,
    ) {
        val transition = SpecTransition(spec, slot, zPolicy)
        when (slot) {
            Slot.ENTER -> fragment.enterTransition = transition
            Slot.EXIT -> fragment.exitTransition = transition
            Slot.RETURN -> fragment.returnTransition = transition
            Slot.REENTER -> fragment.reenterTransition = transition
        }
    }
}
