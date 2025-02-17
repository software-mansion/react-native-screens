package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

abstract class FabricEnabledHeaderSubviewViewGroup(
    context: Context?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    private var lastWidth = 0f
    private var lastHeight = 0f
    private var lastOffsetX = 0f
    private var lastOffsetY = 0f

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    protected fun updateSubviewFrameState(
        width: Int,
        height: Int,
        offsetX: Int,
        offsetY: Int,
    ) {
        updateState(width, height, offsetX, offsetY)
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int,
        offsetX: Int,
        offsetY: Int,
    ) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())
        val offsetXDip: Float = PixelUtil.toDIPFromPixel(offsetX.toFloat())
        val offsetYDip: Float = PixelUtil.toDIPFromPixel(offsetY.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        if (abs(lastWidth - realWidth) < DELTA &&
            abs(lastHeight - realHeight) < DELTA &&
            abs(lastOffsetX - offsetXDip) < DELTA &&
            abs(lastOffsetY - offsetYDip) < DELTA
        ) {
            return
        }

        lastWidth = realWidth
        lastHeight = realHeight
        lastOffsetX = offsetXDip
        lastOffsetY = offsetYDip

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
                putDouble("contentOffsetX", offsetXDip.toDouble())
                putDouble("contentOffsetY", offsetYDip.toDouble())
            }

        mStateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.9f
    }
}
