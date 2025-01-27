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

    private var lastWidth = 0f
    private var lastHeight = 0f
    private var lastPaddingStart = 0f
    private var lastPaddingEnd = 0f

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    fun updatePaddings(
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        // Do nothing on Fabric. This method is used only on Paper.
    }

    fun updateHeaderConfigState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        updateState(width, height, paddingStart, paddingEnd)
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())
        val realPaddingStart: Float = PixelUtil.toDIPFromPixel(paddingStart.toFloat())
        val realPaddingEnd: Float = PixelUtil.toDIPFromPixel(paddingEnd.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        if (abs(lastWidth - realWidth) < DELTA &&
            abs(lastHeight - realHeight) < DELTA &&
            abs(lastPaddingStart - realPaddingStart) < DELTA &&
            abs(lastPaddingEnd - realPaddingEnd) < DELTA
        ) {
            return
        }

        lastWidth = realWidth
        lastHeight = realHeight
        lastPaddingStart = realPaddingStart
        lastPaddingEnd = realPaddingEnd

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
                putDouble("paddingStart", realPaddingStart.toDouble())
                putDouble("paddingEnd", realPaddingEnd.toDouble())
            }
        mStateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.9f
    }
}
