package com.swmansion.rnscreens.core.containers.stack.animation.presets

internal enum class Edge {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    START,
    END,
    ;

    internal fun opposite(): Edge =
        when (this) {
            LEFT -> RIGHT
            RIGHT -> LEFT
            TOP -> BOTTOM
            BOTTOM -> TOP
            START -> END
            END -> START
        }
}
