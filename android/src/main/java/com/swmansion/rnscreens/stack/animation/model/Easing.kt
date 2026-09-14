package com.swmansion.rnscreens.stack.animation.model

internal enum class EasingName {
    ACCELERATE_DECELERATE,
}

internal sealed interface Easing {
    data class Named(
        val name: EasingName,
    ) : Easing
}
