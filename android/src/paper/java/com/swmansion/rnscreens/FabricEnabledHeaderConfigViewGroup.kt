package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
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

    fun setStateWrapper(wrapper: StateWrapper?) = Unit

    // Do nothing on Paper. This method is used only on Fabric.
    fun updateHeaderConfigState(
        width: Int,
        height: Int,
        paddingStart: Int,
        paddingEnd: Int,
    ) = Unit

    fun updatePaddings(
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        // Note that on Paper we do not convert these props from px to dip. This is done internally by RN.
        if (abs(lastPaddingStart - paddingStart) < DELTA && abs(lastPaddingEnd - paddingEnd) < DELTA) {
            return
        }

        lastPaddingStart = paddingStart
        lastPaddingEnd = paddingEnd

        val reactContext = context as? ReactContext
        val uiManagerModule = reactContext?.getNativeModule(UIManagerModule::class.java)
        uiManagerModule?.setViewLocalData(this.id, PaddingBundle(paddingStart.toFloat(), paddingEnd.toFloat()))
    }

    companion object {
        private const val DELTA = 0.9
    }
}
