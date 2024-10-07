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

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    fun updatePaddingsFabric(
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        updateState(paddingStart, paddingEnd)
    }

    @UiThread
    fun updateState(
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        val paddingStartDip: Float = PixelUtil.toDIPFromPixel(paddingStart.toFloat())
        val paddingEndDip: Float = PixelUtil.toDIPFromPixel(paddingEnd.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        if (abs(lastPaddingStart - paddingStart) < DELTA &&
            abs(lastPaddingEnd - paddingEnd) < DELTA
        ) {
            return
        }

        lastPaddingStart = paddingStartDip
        lastPaddingEnd = paddingEndDip

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("paddingStart", paddingStartDip.toDouble())
                putDouble("paddingEnd", paddingEndDip.toDouble())
            }
        mStateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.9f
    }
}
