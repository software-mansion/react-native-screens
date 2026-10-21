package com.swmansion.rnscreens.core.containers.stack.animation.model

internal enum class EasingName {
    ACCELERATE_DECELERATE,
}

internal sealed interface Easing {
    data class Named(
        val name: EasingName,
    ) : Easing
}
