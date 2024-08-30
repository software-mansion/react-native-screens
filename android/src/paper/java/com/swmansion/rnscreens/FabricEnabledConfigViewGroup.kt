package com.swmansion.rnscreens

import android.content.Context
import android.view.ViewGroup
import com.facebook.react.uimanager.StateWrapper

abstract class FabricEnabledConfigViewGroup(
    context: Context?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    fun setStateWrapper(wrapper: StateWrapper?) = Unit

    fun updatePaddingsFabric(
        paddingStart: Int,
        paddingEnd: Int,
    ) = Unit
}
