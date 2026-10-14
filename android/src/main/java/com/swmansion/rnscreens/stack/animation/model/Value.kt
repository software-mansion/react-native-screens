package com.swmansion.rnscreens.stack.animation.model

internal sealed interface Value {
    fun negated(): Value

    data class Dp(
        val value: Float,
    ) : Value {
        override fun negated() = Dp(-value)
    }

    /**
     * Fraction of the container's width (X tracks) or height (Y tracks).
     */
    data class Percent(
        val fraction: Float,
    ) : Value {
        override fun negated() = Percent(-fraction)
    }

    /**
     * Unitless value: an alpha or a scale factor.
     */
    data class Scalar(
        val value: Float,
    ) : Value {
        override fun negated() = Scalar(-value)
    }
}
