package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

/**
 * The only entry point to the preset tables. Definitions are immutable and memoized because
 * resolution runs on every transition read.
 *
 * This package deliberately depends on the platform: [DefaultPreset] picks its table by API
 * level and [Tracks.dim] defaults to a platform colour.
 */
internal object Presets {
    // `rns_no_animation_20.xml`: "non-zero duration ensures transition events are triggered
    // correctly". In v5 a 0 ms transition would also complete a predictive-back pop at gesture
    // start and destroy the fragment before FragmentManager commits it (#4660).
    private const val NONE_DURATION_MS = 20L

    private val cache = HashMap<PresetName, PresetDefinition>()

    internal fun definition(name: PresetName): PresetDefinition = cache.getOrPut(name) { build(name) }

    private fun build(name: PresetName): PresetDefinition =
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
            PresetName.FADE_FROM_BOTTOM -> FadePresets.fadeFrom(Edge.BOTTOM)
            PresetName.FADE_FROM_TOP -> FadePresets.fadeFrom(Edge.TOP)
            PresetName.IOS_FROM_RIGHT -> IosPresets.iosFrom(Edge.RIGHT)
            PresetName.IOS_FROM_LEFT -> IosPresets.iosFrom(Edge.LEFT)
        }
}
