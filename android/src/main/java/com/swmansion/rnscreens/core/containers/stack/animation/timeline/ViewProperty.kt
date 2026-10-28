package com.swmansion.rnscreens.core.containers.stack.animation.timeline

/**
 * A view property a track animates. [restValue] is the `View` default the property returns to
 * after a transition and the value an omitted endpoint of a custom track stands for.
 */
internal enum class ViewProperty(
    internal val restValue: Float,
) {
    OPACITY(restValue = 1f),

    /**
     * Uniform scale about the view's center.
     */
    SCALE(restValue = 1f),
    SCALE_X(restValue = 1f),
    SCALE_Y(restValue = 1f),

    /**
     * Clockwise, in degrees, about the view's center.
     */
    ROTATE(restValue = 0f),
}
