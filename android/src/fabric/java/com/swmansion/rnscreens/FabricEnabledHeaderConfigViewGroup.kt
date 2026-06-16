package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.StateWrapper
import com.swmansion.rnscreens.utils.pxToDp
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

    fun updateHeaderConfigState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        updateState(width, height, paddingStart, paddingEnd)
    }

    @UiThread
    private fun updateState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        // Convert px->dp with this view's own display density (see pxToDp); the global density
        // mis-scales the frame pushed to the Shadow Tree on a non-main-density display. See #4159.
        val realWidth: Float = pxToDp(width.toFloat())
        val realHeight: Float = pxToDp(height.toFloat())
        val realPaddingStart: Float = pxToDp(paddingStart.toFloat())
        val realPaddingEnd: Float = pxToDp(paddingEnd.toFloat())

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
