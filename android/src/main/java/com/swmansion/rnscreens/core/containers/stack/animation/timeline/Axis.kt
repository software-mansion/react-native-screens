package com.swmansion.rnscreens.core.containers.stack.animation.timeline

internal enum class Axis {
    X,
    Y,

    /**
     * X that mirrors in a right-to-left container: positive values move toward the trailing edge.
     */
    LOGICAL_X,
}
