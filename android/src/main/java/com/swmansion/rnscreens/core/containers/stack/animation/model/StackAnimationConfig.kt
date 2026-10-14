package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * What a screen asked for through its `animation` prop, parsed by the mapper. The contract
 * between the React layer (which produces it) and the rest of the package (which only reads it).
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
