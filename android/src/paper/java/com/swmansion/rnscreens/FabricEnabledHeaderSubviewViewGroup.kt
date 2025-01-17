package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import com.facebook.react.uimanager.StateWrapper

abstract class FabricEnabledHeaderSubviewViewGroup(
    context: Context?,
) : ViewGroup(context) {
    fun setStateWrapper(wrapper: StateWrapper?) = Unit

    // Fabric only
    protected fun updateSubviewFrameState(
        width: Int,
        height: Int,
        offsetX: Int,
        offsetY: Int,
    ) = Unit
}
