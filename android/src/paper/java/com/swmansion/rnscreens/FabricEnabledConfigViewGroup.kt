package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.common.UIManagerType
import com.swmansion.rnscreens.utils.PaddingBundle

abstract class FabricEnabledConfigViewGroup(
    context: Context,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    fun setStateWrapper(wrapper: StateWrapper?) = Unit

    fun updatePaddingsFabric(
        paddingStart: Int,
        paddingEnd: Int,
    ) {
        val paddingStartInDip = PixelUtil.toDIPFromPixel(paddingStart.toFloat())
        val paddingEndInDip = PixelUtil.toDIPFromPixel(paddingEnd.toFloat())

        val reactContext = context as ReactContext
        val uiManagerModule = reactContext.getNativeModule(UIManagerModule::class.java)
        uiManagerModule!!.setViewLocalData(this.id, PaddingBundle(paddingStartInDip, paddingEndInDip))
    }
}
