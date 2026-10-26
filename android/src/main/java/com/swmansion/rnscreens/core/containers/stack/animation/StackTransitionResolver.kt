package com.swmansion.rnscreens.core.containers.stack.animation

import com.swmansion.rnscreens.core.containers.stack.animation.engine.ScreenTransition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.presets.PresetDefinition
import com.swmansion.rnscreens.core.containers.stack.animation.presets.presetDefinition
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.core.utils.RNSLog

private const val TAG = "StackTransitionResolver"

/**
 * Picks the transition [fragment] plays in [slot] from the executing operation in [context] and
 * the screens' configs. Without a context nothing animates (the first screen, a stack torn down
 * with its FragmentManager); a fragment outside its role in the context is unexpected and logged.
 */
internal fun resolveStackTransition(
    fragment: StackScreenFragment,
    slot: TransitionSlot,
    context: StackTransitionContext?,
): ScreenTransition? {
    if (context == null) {
        return null
    }
    val expectedFragment = if (slot.isAppearing) context.incoming else context.outgoing
    if (fragment !== expectedFragment) {
        RNSLog.d(TAG, "Transition requested for $fragment in $slot outside its role in the executing operation")
        return null
    }
    val timeline = timelineOf(context)
    val screenTimeline = if (slot.isAppearing) timeline.enter else timeline.exit
    return ScreenTransition(screenTimeline, slot.isAppearing, timeline.exitZOrder)
}

private fun timelineOf(context: StackTransitionContext): TransitionTimeline =
    when (context.kind) {
        // The incoming screen's config governs a push.
        StackTransitionKind.PUSH -> definitionOf(context.incoming).push
        // The outgoing screen's config governs a pop.
        StackTransitionKind.POP -> definitionOf(context.outgoing).pop
        // A replace looks like a pop of the outgoing screen until the `replaceAnimation` PR
        // lets the incoming screen choose a push look instead.
        StackTransitionKind.REPLACE -> definitionOf(context.outgoing).pop
    }

private fun definitionOf(fragment: StackScreenFragment): PresetDefinition =
    when (val config = fragment.item.animation) {
        is StackAnimationConfig.Preset -> presetDefinition(config.name, config.options)
    }
