package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper

abstract class FabricEnabledHeaderSubviewViewGroup(
    context: Context?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

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

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
                putDouble("contentOffsetX", offsetXDip.toDouble())
                putDouble("contentOffsetY", offsetYDip.toDouble())
            }

        mStateWrapper?.updateState(map)
    }
}
