package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.PixelUtil

abstract class FabricEnabledHeaderSubviewGroup(context: Context?): ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    fun updateSubviewFrameState(
        width: Int,
        height: Int
    ) {
        updateState(width, height)
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int
    ) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())
        val map: WritableMap = WritableNativeMap().apply {
            putDouble("frameWidth", realWidth.toDouble())
            putDouble("frameHeight", realHeight.toDouble())
        }

        mStateWrapper?.updateState(map)
    }

}