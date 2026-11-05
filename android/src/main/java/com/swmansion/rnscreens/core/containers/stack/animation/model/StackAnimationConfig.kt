package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * What a screen asked for through its `animation` prop, as parsed by the mapper. An animation
 * defines a push transition and a pop transition; each transition is made of the entering
 * screen's motion and the exiting screen's motion.
 */
internal sealed interface StackAnimationConfig {
    data class Preset(
        val preset: PresetConfig,
    ) : StackAnimationConfig {
        init {
            preset.requireAllowedAt(PresetLevel.ANIMATION)
        }
    }

    /**
     * The push and pop transitions named separately. An omitted one is `none`; the mapper never
     * leaves one out.
     */
    data class Custom(
        val push: TransitionConfig,
        val pop: TransitionConfig,
    ) : StackAnimationConfig

    companion object {
        internal val DEFAULT: StackAnimationConfig = Preset(PresetConfig(PresetName.DEFAULT))
    }
}
