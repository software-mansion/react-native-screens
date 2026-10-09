package com.swmansion.rnscreens.stack.animation

import com.swmansion.rnscreens.stack.animation.engine.SpecTransition
import com.swmansion.rnscreens.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec
import com.swmansion.rnscreens.stack.animation.spec.ZPolicy
import com.swmansion.rnscreens.stack.screen.StackScreenFragment

/**
 * Writes fragment transition slots ahead of FragmentManager reading them: at batch
 * computation, on a top-screen prop update and after a native pop.
 *
 * Only the top pair of a batch is written. Screens added and detached (or attached and
 * removed) within the same batch never get a view, so FragmentManager creates no
 * operation for them and never reads their slots.
 */
internal object StackAnimationAssigner {
    fun assignBatch(
        previousTop: StackScreenFragment?,
        kind: StackAnimationBatchKind,
        newTop: StackScreenFragment,
        belowNewTop: StackScreenFragment?,
    ) {
        when {
            // The first screen is not a back stack record; nothing animates.
            previousTop == null -> Unit

            kind == StackAnimationBatchKind.PUSH -> {
                val row = StackAnimationResolver.pushRow(newTop.stackScreen)
                write(newTop, TransitionSlot.ENTER, row.inSlot)
                write(previousTop, TransitionSlot.EXIT, row.outSlot, row.outZPolicy)
            }

            kind == StackAnimationBatchKind.POP -> {
                val row = StackAnimationResolver.popRow(previousTop.stackScreen)
                write(previousTop, TransitionSlot.RETURN, row.outSlot, row.outZPolicy)
                // After a multi-pop the revealed screen's slot still holds the row of the screen
                // that used to sit directly on it.
                write(newTop, TransitionSlot.REENTER, row.inSlot)
            }

            else -> {
                val row = StackAnimationResolver.replaceRow(newTop.stackScreen, previousTop.stackScreen)
                write(newTop, TransitionSlot.ENTER, row.inSlot)
                write(previousTop, TransitionSlot.EXIT, row.outSlot, row.outZPolicy)
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
        write(top, TransitionSlot.RETURN, row.outSlot, row.outZPolicy)
        write(under, TransitionSlot.REENTER, row.inSlot)
    }

    private fun write(
        fragment: StackScreenFragment,
        slot: TransitionSlot,
        spec: SlotSpec,
        zPolicy: ZPolicy = ZPolicy.OVER,
    ) {
        val transition = SpecTransition(spec, slot, zPolicy)
        when (slot) {
            TransitionSlot.ENTER -> fragment.enterTransition = transition
            TransitionSlot.EXIT -> fragment.exitTransition = transition
            TransitionSlot.RETURN -> fragment.returnTransition = transition
            TransitionSlot.REENTER -> fragment.reenterTransition = transition
        }
    }
}
