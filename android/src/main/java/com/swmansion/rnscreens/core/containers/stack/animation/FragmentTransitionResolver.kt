package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.engine.MotionVisibility
import com.swmansion.rnscreens.core.containers.stack.animation.engine.StackFragmentTransitionSlot
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.animation.presets.transitionTimelineOf
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.core.utils.RNSLog

private const val TAG = "FragmentTransitionResolver"

/**
 * Picks the fragment transition [fragment] plays in [slot] from the executing operation in
 * [context] and the screens' configs. Without a context nothing animates (the first screen, a
 * stack torn down with its FragmentManager); a fragment outside its role in the context is
 * unexpected and logged.
 */
internal fun resolveFragmentTransition(
    fragment: StackScreenFragment,
    slot: StackFragmentTransitionSlot,
    context: StackOperationContext?,
): MotionVisibility? {
    if (context == null) {
        return null
    }
    val expectedFragment = if (slot.isAppearing) context.incoming else context.outgoing
    if (fragment !== expectedFragment) {
        RNSLog.d(TAG, "Transition requested for $fragment in $slot outside its role in the executing operation")
        return null
    }
    val timeline = timelineOf(context)
    val motion = if (slot.isAppearing) timeline.enter else timeline.exit
    return MotionVisibility(motion, slot.isAppearing, timeline.exitZOrder)
}

/**
 * Which screen's config governs the operation, and which of its two transitions plays.
 */
private fun timelineOf(context: StackOperationContext): TransitionTimeline =
    when (context.kind) {
        // The incoming screen's config governs a push.
        StackOperationKind.PUSH -> transitionTimelineOf(context.incoming.item.animation, StackTransitionKind.PUSH)
        // The outgoing screen's config governs a pop.
        StackOperationKind.POP -> transitionTimelineOf(context.outgoing.item.animation, StackTransitionKind.POP)
        // The incoming screen chooses; the outgoing screen's z-order follows the chosen timeline.
        StackOperationKind.REPLACE ->
            when (context.incoming.item.replaceAnimation) {
                StackTransitionKind.PUSH -> transitionTimelineOf(context.incoming.item.animation, StackTransitionKind.PUSH)
                StackTransitionKind.POP -> transitionTimelineOf(context.outgoing.item.animation, StackTransitionKind.POP)
            }
    }
