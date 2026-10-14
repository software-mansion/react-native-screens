package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.engine.ScreenTransition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.presets.PresetDefinition
import com.swmansion.rnscreens.core.containers.stack.animation.presets.presetDefinition
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment

/**
 * Pure: picks the transition a fragment plays in a slot from the container's context about the
 * executing operation and the screens' configs.
 *
 * Only one bit of the slot is used, whether the reader's view is appearing or disappearing,
 * which FragmentManager guarantees by construction (an appearing slot is read only for a
 * fragment whose final state is visible). Its push / pop classification is never consulted.
 */
internal fun resolveStackTransition(
    reader: StackScreenFragment,
    slot: TransitionSlot,
    context: StackTransitionContext?,
    screenAbove: (StackScreenFragment) -> StackScreenFragment?,
): ScreenTransition? {
    val timeline: TransitionTimeline =
        if (context != null && reader === (if (slot.isAppearing) context.incoming else context.outgoing)) {
            // A batch of ours is executing and the reader plays its role in it.
            timelineOf(context)
        } else if (!slot.isAppearing) {
            // Otherwise FragmentManager started a pop by itself (predictive back at gesture
            // start): the popped screen plays its own pop ...
            definitionOf(reader).pop
        } else {
            // ... and the revealed screen plays the pop of the screen above it. Nothing above
            // means the first screen, which never animates.
            val above = screenAbove(reader) ?: return null
            definitionOf(above).pop
        }
    val screenTimeline = if (slot.isAppearing) timeline.enter else timeline.exit
    return ScreenTransition(screenTimeline, slot.isAppearing, timeline.exitZOrder)
}

private fun timelineOf(context: StackTransitionContext): TransitionTimeline =
    when (context.kind) {
        // The incoming screen's config governs a push: the covered screen goes under it.
        StackTransitionKind.PUSH -> definitionOf(context.incoming).push
        // The outgoing screen's config governs a pop: the popped screen stays on top.
        StackTransitionKind.POP -> definitionOf(context.outgoing).pop
        // A replace looks like a pop of the outgoing screen until the `replaceAnimation` PR
        // lets the incoming screen choose a push look instead.
        StackTransitionKind.REPLACE -> definitionOf(context.outgoing).pop
    }

private fun definitionOf(fragment: StackScreenFragment): PresetDefinition =
    when (val config = fragment.animationConfig) {
        is StackAnimationConfig.Preset -> presetDefinition(config.name, config.options)
    }
