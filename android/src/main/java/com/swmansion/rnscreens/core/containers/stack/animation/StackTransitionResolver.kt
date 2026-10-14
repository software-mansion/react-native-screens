package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.engine.ScreenTransition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.presets.Presets
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
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
    ): ScreenTransition? {
        val timeline: TransitionTimeline =
            when {
                // A batch of ours is executing and the reader plays its role in it.
                context != null && !slot.isAppearing && reader === context.outgoing -> timelineOf(context)
                context != null && slot.isAppearing && reader === context.incoming -> timelineOf(context)
                // Otherwise FragmentManager started a pop by itself (predictive back at gesture
                // start): the popped screen plays its own pop ...
                !slot.isAppearing -> popTimelineOf(reader)
                // ... and the revealed screen plays the pop of the screen above it. Nothing
                // above means the first screen, which never animates.
                else -> screenAbove(reader)?.let { popTimelineOf(it) } ?: return null
            }
        val side = if (slot.isAppearing) timeline.enter else timeline.exit
        return ScreenTransition(side, slot.isAppearing, timeline.exitZOrder)
    }

    private fun timelineOf(context: StackTransitionContext): TransitionTimeline =
        when (context.kind) {
            // The incoming screen's config governs a push: the covered screen goes under it.
            StackTransitionKind.PUSH -> pushTimelineOf(context.incoming)
            // The outgoing screen's config governs a pop: the popped screen stays on top.
            StackTransitionKind.POP -> popTimelineOf(context.outgoing)
            // A replace looks like a pop of the outgoing screen until the `replaceAnimation` PR
            // lets the incoming screen choose a push look instead.
            StackTransitionKind.REPLACE -> popTimelineOf(context.outgoing)
        }

    private fun pushTimelineOf(fragment: StackScreenFragment): TransitionTimeline = definitionOf(fragment).push

    private fun popTimelineOf(fragment: StackScreenFragment): TransitionTimeline = definitionOf(fragment).pop

    private fun definitionOf(fragment: StackScreenFragment) =
        when (val config = fragment.animationConfig) {
            is StackAnimationConfig.Preset -> Presets.definition(config.name)
        }
}
