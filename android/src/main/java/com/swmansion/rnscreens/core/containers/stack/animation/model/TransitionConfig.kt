package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * One `push` or `pop` value of a custom animation: a whole transition, both screens included.
 */
internal sealed interface TransitionConfig {
    data class Preset(
        val preset: PresetConfig,
    ) : TransitionConfig {
        init {
            preset.requireAllowedAt(PresetLevel.TRANSITION)
        }
    }

    /**
     * The two screens' motions named separately. An omitted one is `none`, a static screen
     * spanning the transition; the mapper never leaves one out.
     */
    data class Custom(
        val enter: MotionConfig,
        val exit: MotionConfig,
    ) : TransitionConfig
}
