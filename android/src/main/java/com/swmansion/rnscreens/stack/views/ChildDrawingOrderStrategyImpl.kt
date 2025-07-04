package com.swmansion.rnscreens.stack.views

import com.swmansion.rnscreens.ScreenStack
import java.util.Collections

internal abstract class ChildrenDrawingOrderStrategyBase(
    var enabled: Boolean = false,
) : ChildrenDrawingOrderStrategy {
    override fun enable() {
        enabled = true
    }

    override fun disable() {
        enabled = false
    }

    override fun isEnabled() = enabled
}

internal class ReverseFromIndex(
    val startIndex: Int,
) : ChildrenDrawingOrderStrategyBase() {
    override fun apply(drawingOperations: MutableList<ScreenStack.DrawingOp>) {
        if (!isEnabled()) {
            return
        }

        var currentLeftIndex = startIndex
        var currentRightIndex = drawingOperations.lastIndex

        while (currentLeftIndex < currentRightIndex) {
            Collections.swap(drawingOperations, currentLeftIndex, currentRightIndex)
            currentLeftIndex += 1
            currentRightIndex -= 1
        }
    }
}

internal class ReverseOrder : ChildrenDrawingOrderStrategyBase() {
    override fun apply(drawingOperations: MutableList<ScreenStack.DrawingOp>) {
        if (!isEnabled()) {
            return
        }

        drawingOperations.reverse()
    }
}
