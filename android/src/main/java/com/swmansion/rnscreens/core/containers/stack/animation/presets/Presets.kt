package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOptions
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

// Taken from the legacy implementation's `rns_no_animation_20.xml`: "non-zero duration ensures
// transition events are triggered correctly". In v5 a 0 ms transition would also complete a
// predictive-back pop at gesture start and destroy the fragment before FragmentManager commits
// it; 1 ms already avoids that, 20 keeps the legacy value.
private const val NONE_DURATION_MS = 20L

/**
 * Options are applied while the tables are built, which is cheap enough to do on every request.
 */
internal fun presetDefinition(
    name: PresetName,
    options: PresetOptions,
): PresetDefinition {
    var definition = baseDefinition(name, options)
    options.durationMs?.let { definition = definition.retimed(it) }
    options.easing?.let { definition = definition.withEasing(it) }
    return definition
}

private fun baseDefinition(
    name: PresetName,
    options: PresetOptions,
): PresetDefinition =
    when (name) {
        PresetName.DEFAULT -> defaultPreset()
        PresetName.NONE ->
            PresetDefinition(
                push = TransitionTimeline.static(NONE_DURATION_MS, ZOrder.UNDER),
                pop = TransitionTimeline.static(NONE_DURATION_MS, ZOrder.OVER),
            )
        PresetName.FADE -> fadePreset()
        PresetName.SLIDE_FROM_RIGHT -> slideFromPreset(Edge.RIGHT)
        PresetName.SLIDE_FROM_LEFT -> slideFromPreset(Edge.LEFT)
        PresetName.SLIDE_FROM_BOTTOM -> slideFromPreset(Edge.BOTTOM)
        PresetName.SLIDE_FROM_TOP -> slideFromPreset(Edge.TOP)
        PresetName.FADE_FROM_BOTTOM -> fadeFromPreset(Edge.BOTTOM, options.distance)
        PresetName.FADE_FROM_TOP -> fadeFromPreset(Edge.TOP, options.distance)
        PresetName.IOS_FROM_RIGHT -> iosFromPreset(Edge.RIGHT)
        PresetName.IOS_FROM_LEFT -> iosFromPreset(Edge.LEFT)
    }
