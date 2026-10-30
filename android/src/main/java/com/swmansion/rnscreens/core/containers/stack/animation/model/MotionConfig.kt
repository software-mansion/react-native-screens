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

    /**
     * The motion written as tracks, one per animated property. A property without a track stays
     * at rest and a motion without tracks is a static screen, like `none`. `scaleX` and `scaleY`
     * take their axis over `scale`.
     */
    data class Custom(
        val translateX: TrackConfig.Translate? = null,
        val translateY: TrackConfig.Translate? = null,
        val opacity: TrackConfig.Fraction? = null,
        val scale: TrackConfig.Scalar? = null,
        val scaleX: TrackConfig.Scalar? = null,
        val scaleY: TrackConfig.Scalar? = null,
        val rotate: TrackConfig.Scalar? = null,
        val dim: TrackConfig.Dim? = null,
    ) : MotionConfig
}
