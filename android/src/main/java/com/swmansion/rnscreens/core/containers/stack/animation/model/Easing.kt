package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * Curves are named, never transcribed: the engine loads each one from the platform's or
 * Material Components' interpolator resources.
 */
internal enum class EasingName {
    LINEAR,
    ACCELERATE_DECELERATE,
    ACCELERATE_QUINT,
    DECELERATE_QUINT,
    EMPHASIZED,
}

internal sealed interface Easing {
    data class Named(
        val name: EasingName,
    ) : Easing
}
