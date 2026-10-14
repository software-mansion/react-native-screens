package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOptions
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

/**
 * The only entry point to the preset tables. Options are applied here, while the tables are
 * built; the resolver only picks a transition for an operation. Definitions are immutable and
 * memoized per (name, options) because resolution runs on every transition read.
 *
 * This package deliberately depends on the platform: [DefaultPreset] picks its table by API
 * level and [Tracks.dim] defaults to a platform colour.
 */
internal object Presets {
    // `rns_no_animation_20.xml`: "non-zero duration ensures transition events are triggered
    // correctly". In v5 a 0 ms transition would also complete a predictive-back pop at gesture
    // start and destroy the fragment before FragmentManager commits it (#4660).
    private const val NONE_DURATION_MS = 20L

    private data class Key(
        val name: PresetName,
        val options: PresetOptions,
    )

    // Main thread only: resolution happens while FragmentManager executes an operation.
    private val cache = HashMap<Key, PresetDefinition>()

    internal fun definition(
        name: PresetName,
        options: PresetOptions,
    ): PresetDefinition = cache.getOrPut(Key(name, options)) { build(name, options) }

    private fun build(
        name: PresetName,
        options: PresetOptions,
    ): PresetDefinition {
        var definition = authored(name, options)
        options.durationMs?.let { definition = definition.retimed(it) }
        options.easing?.let { definition = definition.withEasing(it) }
        return definition
    }

    private fun authored(
        name: PresetName,
        options: PresetOptions,
    ): PresetDefinition =
        when (name) {
            PresetName.DEFAULT -> DefaultPreset.definition
            PresetName.NONE ->
                PresetDefinition(
                    push = TransitionTimeline.static(NONE_DURATION_MS, ZOrder.UNDER),
                    pop = TransitionTimeline.static(NONE_DURATION_MS, ZOrder.OVER),
                )
            PresetName.FADE -> FadePresets.fade()
            PresetName.SLIDE_FROM_RIGHT -> SlidePresets.slideFrom(Edge.RIGHT)
            PresetName.SLIDE_FROM_LEFT -> SlidePresets.slideFrom(Edge.LEFT)
            PresetName.SLIDE_FROM_BOTTOM -> SlidePresets.slideFrom(Edge.BOTTOM)
            PresetName.SLIDE_FROM_TOP -> SlidePresets.slideFrom(Edge.TOP)
            PresetName.FADE_FROM_BOTTOM -> FadePresets.fadeFrom(Edge.BOTTOM, options.distance ?: FadePresets.DISTANCE_RISE)
            PresetName.FADE_FROM_TOP -> FadePresets.fadeFrom(Edge.TOP, options.distance ?: FadePresets.DISTANCE_RISE)
            PresetName.IOS_FROM_RIGHT -> IosPresets.iosFrom(Edge.RIGHT)
            PresetName.IOS_FROM_LEFT -> IosPresets.iosFrom(Edge.LEFT)
        }
}
