package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

abstract class FabricEnabledHeaderConfigViewGroup(
    context: Context?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    private var lastPaddingStart = 0f
    private var lastPaddingEnd = 0f
    private var lastWidth = 0f
    private var lastHeight = 0f

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    fun updateHeaderConfigState(
        paddingStart: Int,
        paddingEnd: Int,
        width: Int,
        height: Int,
    ) {
        updateState(paddingStart, paddingEnd, width, height)
    }

    @UiThread
    fun updateState(
        paddingStart: Int,
        paddingEnd: Int,
        width: Int,
        height: Int,
    ) {
        val paddingStartDip: Float = PixelUtil.toDIPFromPixel(paddingStart.toFloat())
        val paddingEndDip: Float = PixelUtil.toDIPFromPixel(paddingEnd.toFloat())
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        if (abs(lastPaddingStart - paddingStartDip) < DELTA &&
            abs(lastPaddingEnd - paddingEndDip) < DELTA &&
            abs(lastWidth - realWidth) < DELTA &&
            abs(lastHeight - realHeight) < DELTA
        ) {
            return
        }

        lastPaddingStart = paddingStartDip
        lastPaddingEnd = paddingEndDip
        lastWidth = realWidth
        lastHeight = realHeight

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("paddingStart", paddingStartDip.toDouble())
                putDouble("paddingEnd", paddingEndDip.toDouble())
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
            }
        mStateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.9f
    }
}
