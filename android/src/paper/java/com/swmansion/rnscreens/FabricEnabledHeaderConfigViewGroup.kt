package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.UIManagerModule
import com.swmansion.rnscreens.utils.PaddingBundle
import kotlin.math.abs

abstract class FabricEnabledHeaderConfigViewGroup(
    context: Context,
) : ViewGroup(context) {
    private var lastPaddingStart = 0
    private var lastPaddingEnd = 0
    private var lastHeight = 0

    fun setStateWrapper(wrapper: StateWrapper?) = Unit

    fun updateHeaderConfigState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
      // Implementation of this method differs between Fabric & Paper!
      updateState(width, height, paddingStart, paddingEnd)
    }

    // Implementation of this method differs between Fabric & Paper!
    @UiThread
    private fun updateState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        // Note that on Paper we do not convert these props from px to dip. This is done internally by RN.
        if (abs(lastPaddingStart - paddingStart) < DELTA && abs(lastPaddingEnd - paddingEnd) < DELTA && abs(lastHeight - height) < DELTA) {
            return
        }

        lastPaddingStart = paddingStart
        lastPaddingEnd = paddingEnd
        lastHeight = height

        val reactContext = context as? ReactContext
        val uiManagerModule = reactContext?.getNativeModule(UIManagerModule::class.java)
        uiManagerModule?.setViewLocalData(this.id, PaddingBundle(height.toFloat(), paddingStart.toFloat(), paddingEnd.toFloat()))
    }

    companion object {
        private const val DELTA = 0.9
    }
}
