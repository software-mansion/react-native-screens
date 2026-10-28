package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

/**
 * Both transitions of a preset, defined in absolute milliseconds. The reference duration a
 * `duration` option rescales against is derived: the longer of the two.
 */
internal data class PresetDefinition(
    val push: TransitionTimeline,
    val pop: TransitionTimeline,
) {
    internal val referenceDurationMs: Long
        get() = maxOf(push.durationMs, pop.durationMs)

    /**
     * Both transitions scaled by the same factor, so the preset's own asymmetry survives.
     */
    internal fun retimed(durationMs: Long): PresetDefinition {
        val factor = durationMs.toFloat() / referenceDurationMs
        return PresetDefinition(push.scaled(factor), pop.scaled(factor))
    }

    /**
     * Every track of both transitions on one curve, the dim included.
     */
    internal fun withEasing(easing: Easing): PresetDefinition = PresetDefinition(push.withEasing(easing), pop.withEasing(easing))
}

/**
 * On a push the covered screen is drawn under the entering one.
 */
internal fun pushTimeline(
    enter: List<Track>,
    exit: List<Track>,
): TransitionTimeline = TransitionTimeline.of(enter, exit, ZOrder.UNDER)

/**
 * On a pop the popped screen stays on top of the revealed one.
 */
internal fun popTimeline(
    enter: List<Track>,
    exit: List<Track>,
): TransitionTimeline = TransitionTimeline.of(enter, exit, ZOrder.OVER)
