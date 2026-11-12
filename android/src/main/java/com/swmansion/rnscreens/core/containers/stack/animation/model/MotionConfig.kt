package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * One `enter` or `exit` value of a custom transition: one screen's motion.
 */
internal sealed interface MotionConfig {
    data class Preset(
        val preset: PresetConfig,
    ) : MotionConfig {
        init {
            preset.requireAllowedAt(PresetLevel.MOTION)
        }
    }
}
