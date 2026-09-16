package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.PresetName

internal object Presets {
    // Non-zero so that a predictive back gesture scrubs the pop instead of completing it at
    // gesture start, which destroys the fragment before FragmentManager commits the pop.
    private const val NONE_DURATION_MS = 20L

    fun definition(name: PresetName): PresetDefinition =
        when (name) {
            PresetName.DEFAULT -> DefaultPreset.definition
            PresetName.SLIDE_FROM_RIGHT -> SlidePresets.slideFrom(Edge.RIGHT)
            PresetName.SLIDE_FROM_LEFT -> SlidePresets.slideFrom(Edge.LEFT)
            PresetName.SLIDE_FROM_BOTTOM -> SlidePresets.slideFrom(Edge.BOTTOM)
            PresetName.SLIDE_FROM_TOP -> SlidePresets.slideFrom(Edge.TOP)
            PresetName.FADE -> FadePresets.fade()
            PresetName.FADE_FROM_BOTTOM -> FadePresets.fadeFrom(Edge.BOTTOM)
            PresetName.FADE_FROM_TOP -> FadePresets.fadeFrom(Edge.TOP)
            PresetName.IOS_FROM_RIGHT -> IosPresets.iosFrom(Edge.RIGHT)
            PresetName.IOS_FROM_LEFT -> IosPresets.iosFrom(Edge.LEFT)
            PresetName.NONE ->
                PresetDefinition(
                    referenceDurationMs = NONE_DURATION_MS,
                    push = AuthoredRow(inSlot = null, outSlot = null),
                    pop = AuthoredRow(inSlot = null, outSlot = null),
                )
        }
}
