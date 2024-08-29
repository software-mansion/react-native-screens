package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

abstract class FabricEnabledConfigViewGroup(
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
        val paddingLeftInDIP: Float = PixelUtil.toDIPFromPixel(paddingStart.toFloat())
        val paddingRightInDIP: Float = PixelUtil.toDIPFromPixel(paddingEnd.toFloat())
        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.

        val delta = 0.9f
        if (abs(lastPaddingStart - paddingStart) < delta &&
            abs(lastPaddingEnd - paddingEnd) < delta
        ) {
            return
        }

        lastPaddingStart = paddingLeftInDIP
        lastPaddingEnd = paddingRightInDIP

        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("paddingStart", paddingLeftInDIP.toDouble())
                putDouble("paddingEnd", paddingRightInDIP.toDouble())
            }
        mStateWrapper?.updateState(map)
    }
}
