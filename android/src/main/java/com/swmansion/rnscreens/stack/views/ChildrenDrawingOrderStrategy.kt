package com.swmansion.rnscreens.stack.views

import com.swmansion.rnscreens.ScreenStack

internal interface ChildrenDrawingOrderStrategy {
    /**
     * Mutates the list of draw operations **in-place**.
     */
    fun apply(drawingOperations: MutableList<ScreenStack.DrawingOp>)

    /**
     * Enables the given strategy. When enabled - the strategy **might** mutate the operations
     * list passed to `apply` method.
     */
    fun enable()

    /**
     * Disables the given strategy - even when `apply` is called it **must not** produce
     * any side effect (it must not manipulate the drawing operations list passed to `apply` method).
     */
    fun disable()

    fun isEnabled(): Boolean
}
