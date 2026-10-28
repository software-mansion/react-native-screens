package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * When a track of a custom motion runs: [delayMs] after the transition starts, for [durationMs],
 * on [easing]; `null` is the default curve, see `customMotionTracks`. Until the delay elapses the
 * property sits at the track's `from` value, not at rest.
 */
internal data class TrackTimingConfig(
    val durationMs: Long,
    val delayMs: Long = 0L,
    val easing: Easing? = null,
) {
    init {
        require(durationMs >= 1L) { "[RNScreens] A track duration must be at least 1 ms." }
        require(delayMs >= 0L) { "[RNScreens] A track cannot start before the transition." }
    }
}

/**
 * One animated property of a custom motion as a `from` / `to` span. An omitted endpoint is the
 * property's rest value, filled in when the motion is resolved; with both omitted the track holds
 * it, which only lengthens the transition.
 */
internal sealed interface TrackConfig {
    val timing: TrackTimingConfig

    sealed interface Numeric : TrackConfig {
        val from: Float?
        val to: Float?
    }

    data class Scalar(
        override val from: Float?,
        override val to: Float?,
        override val timing: TrackTimingConfig,
    ) : Numeric {
        init {
            requireFiniteEndpoints(from, to)
        }
    }

    /**
     * A scalar in [0, 1].
     */
    data class Fraction(
        override val from: Float?,
        override val to: Float?,
        override val timing: TrackTimingConfig,
    ) : Numeric {
        init {
            requireUnitEndpoints(from, to)
        }
    }

    /**
     * A translation along one axis; the endpoints are lengths the engine resolves against the
     * container. An omitted endpoint is zero.
     */
    data class Translate(
        val from: Length?,
        val to: Length?,
        override val timing: TrackTimingConfig,
    ) : TrackConfig

    /**
     * A scrim over the screen whose alpha spans [from] to [to]; an omitted endpoint is an absent
     * scrim. A `null` [color] is the default one.
     */
    data class Dim(
        val color: Int?,
        override val from: Float?,
        override val to: Float?,
        override val timing: TrackTimingConfig,
    ) : Numeric {
        init {
            requireUnitEndpoints(from, to)
        }
    }
}

private fun requireFiniteEndpoints(
    from: Float?,
    to: Float?,
) = require(from?.isFinite() != false && to?.isFinite() != false) { "[RNScreens] A track needs finite endpoints." }

private fun requireUnitEndpoints(
    from: Float?,
    to: Float?,
) = require(from?.let { it in 0f..1f } != false && to?.let { it in 0f..1f } != false) {
    "[RNScreens] opacity and dim values must be in [0, 1]."
}
