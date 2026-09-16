package com.swmansion.rnscreens.stack.animation.model

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
