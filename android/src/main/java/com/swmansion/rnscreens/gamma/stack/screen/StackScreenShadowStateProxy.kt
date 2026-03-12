package com.swmansion.rnscreens.gamma.stack.screen

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

internal class StackScreenShadowStateProxy {
    internal var stateWrapper: StateWrapper? = null

    private var lastXInDp: Float = 0f
    private var lastYInDp: Float = 0f
    private var lastWidthInDp: Float = 0f
    private var lastHeightInDp: Float = 0f

    fun updateStateIfNeeded(
        x: Int,
        y: Int,
        width: Int,
        height: Int,
    ) {
        val xInDp: Float = PixelUtil.toDIPFromPixel(x.toFloat())
        val yInDp: Float = PixelUtil.toDIPFromPixel(y.toFloat())
        val widthInDp: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val heightInDp: Float = PixelUtil.toDIPFromPixel(height.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        if (
            abs(lastXInDp - xInDp) < DELTA &&
            abs(lastYInDp - yInDp) < DELTA &&
            abs(lastWidthInDp - widthInDp) < DELTA &&
            abs(lastHeightInDp - heightInDp) < DELTA
        ) {
            return
        }

        lastXInDp = xInDp
        lastYInDp = yInDp
        lastWidthInDp = widthInDp
        lastHeightInDp = heightInDp

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", widthInDp.toDouble())
                putDouble("frameHeight", heightInDp.toDouble())
                putDouble("contentOffsetX", xInDp.toDouble())
                putDouble("contentOffsetY", yInDp.toDouble())
            }
        stateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.9f
    }
}