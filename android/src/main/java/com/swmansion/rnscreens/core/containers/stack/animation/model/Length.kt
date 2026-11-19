package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * A distance on the screen, resolved to pixels by the engine.
 */
internal sealed interface Length {
    data class Dp(
        val value: Float,
    ) : Length

    /**
     * A fraction of the container's width (X tracks) or height (Y tracks): `0.3f` for `'30%'`.
     */
    data class Percent(
        val fraction: Float,
    ) : Length

    fun negated(): Length =
        when (this) {
            is Dp -> Dp(-value)
            is Percent -> Percent(-fraction)
        }

    companion object {
        internal val ZERO: Length = Percent(0f)
    }
}
