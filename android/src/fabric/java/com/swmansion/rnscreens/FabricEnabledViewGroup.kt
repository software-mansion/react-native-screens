package com.swmansion.rnscreens

import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

abstract class FabricEnabledViewGroup(
    context: ReactContext?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    private var lastWidth = 0f
    private var lastHeight = 0f
    private var lastHeaderHeight = 0f

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    protected fun updateScreenSizeFabric(
        width: Int,
        height: Int,
        headerHeight: Int,
    ) {
        updateState(width, height, headerHeight)
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int,
        headerHeight: Int,
    ) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())
        val realHeaderHeight: Float = PixelUtil.toDIPFromPixel(headerHeight.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        val delta = 0.9f
        if (abs(lastWidth - realWidth) < delta &&
            abs(lastHeight - realHeight) < delta &&
            abs(lastHeaderHeight - realHeaderHeight) < delta
        ) {
            return
        }

        lastWidth = realWidth
        lastHeight = realHeight
        lastHeaderHeight = realHeaderHeight
        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
                putDouble("contentOffsetX", 0.0)
                putDouble("contentOffsetY", realHeaderHeight.toDouble())
            }
        mStateWrapper?.updateState(map)
    }
}
