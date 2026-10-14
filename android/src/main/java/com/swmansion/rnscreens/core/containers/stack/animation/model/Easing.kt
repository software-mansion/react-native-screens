package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * Curves are named, never transcribed: the engine loads each one from the platform's or
 * Material Components' interpolator resources, or from the CSS specification's constants.
 */
internal enum class EasingName(
    /**
     * The name on the JS side, `null` for the legacy platform curves the preset tables use.
     */
    internal val stringName: String?,
) {
    LINEAR("linear"),
    EASE_IN("easeIn"),
    EASE_OUT("easeOut"),
    EASE_IN_OUT("easeInOut"),
    STANDARD("standard"),
    STANDARD_ACCELERATE("standardAccelerate"),
    STANDARD_DECELERATE("standardDecelerate"),
    EMPHASIZED("emphasized"),
    EMPHASIZED_ACCELERATE("emphasizedAccelerate"),
    EMPHASIZED_DECELERATE("emphasizedDecelerate"),
    ACCELERATE_DECELERATE(null),
    ACCELERATE_QUINT(null),
    DECELERATE_QUINT(null),
    ;

    companion object {
        internal fun fromString(value: String): EasingName =
            entries.firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation easing: $value.")
    }
}

internal sealed interface Easing {
    data class Named(
        val name: EasingName,
    ) : Easing

    /**
     * A cubic bezier with control points (x1, y1) and (x2, y2).
     */
    data class Bezier(
        val x1: Float,
        val y1: Float,
        val x2: Float,
        val y2: Float,
    ) : Easing {
        init {
            // A control point outside the unit interval on X makes the curve loop back on
            // itself, which `PathInterpolator` rejects at transition time, too late to fall back.
            require(x1 in 0f..1f && x2 in 0f..1f) { "[RNScreens] A bezier easing needs x1 and x2 in [0, 1]." }
            require(y1.isFinite() && y2.isFinite()) { "[RNScreens] A bezier easing needs finite control points." }
        }
    }
}
