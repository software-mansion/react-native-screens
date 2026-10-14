package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * What a screen asked for through its `animation` prop, as parsed by the mapper. The rest of
 * the package only reads it.
 */
internal sealed interface StackAnimationConfig {
    data class Preset(
        val name: PresetName,
        val options: PresetOptions = PresetOptions.NONE,
    ) : StackAnimationConfig

    companion object {
        internal val DEFAULT: StackAnimationConfig = Preset(PresetName.DEFAULT)
    }
}
