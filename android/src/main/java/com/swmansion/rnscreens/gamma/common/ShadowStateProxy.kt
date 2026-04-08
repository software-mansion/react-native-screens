package com.swmansion.rnscreens.gamma.common

import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

internal class ShadowStateProxy(
    private val includesFrameSize: Boolean = true,
) {
    internal var stateWrapper: StateWrapper? = null

    private var lastFrameWidthInDp: Float = 0f
    private var lastFrameHeightInDp: Float = 0f
    private var lastContentOffsetXInDp: Float = 0f
    private var lastContentOffsetYInDp: Float = 0f

    fun updateStateIfNeeded(
        frameWidth: Int? = null,
        frameHeight: Int? = null,
        contentOffsetX: Int? = null,
        contentOffsetY: Int? = null,
    ) {
        val widthInDp = frameWidth?.let { PixelUtil.toDIPFromPixel(it.toFloat()) } ?: lastFrameWidthInDp
        val heightInDp = frameHeight?.let { PixelUtil.toDIPFromPixel(it.toFloat()) } ?: lastFrameHeightInDp
        val offsetXInDp = contentOffsetX?.let { PixelUtil.toDIPFromPixel(it.toFloat()) } ?: lastContentOffsetXInDp
        val offsetYInDp = contentOffsetY?.let { PixelUtil.toDIPFromPixel(it.toFloat()) } ?: lastContentOffsetYInDp

        if (
            abs(lastFrameWidthInDp - widthInDp) < DELTA &&
            abs(lastFrameHeightInDp - heightInDp) < DELTA &&
            abs(lastContentOffsetXInDp - offsetXInDp) < DELTA &&
            abs(lastContentOffsetYInDp - offsetYInDp) < DELTA
        ) {
            return
        }

        lastFrameWidthInDp = widthInDp
        lastFrameHeightInDp = heightInDp
        lastContentOffsetXInDp = offsetXInDp
        lastContentOffsetYInDp = offsetYInDp

        val map =
            WritableNativeMap().apply {
                if (includesFrameSize) {
                    putDouble("frameWidth", widthInDp.toDouble())
                    putDouble("frameHeight", heightInDp.toDouble())
                }
                putDouble("contentOffsetX", offsetXInDp.toDouble())
                putDouble("contentOffsetY", offsetYInDp.toDouble())
            }
        stateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.1f
    }
}
