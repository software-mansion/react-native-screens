package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext

/**
 * React Component view.
 */
class TabScreen(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext) {
    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    internal val eventEmitter = TabScreenEventEmitter(reactContext)

    override fun setId(id: Int) {
        super.setId(id)
        eventEmitter.viewTag = id
    }

    override fun onAttachedToWindow() {
        Log.d(TAG, "TabScreen attached to window")
        super.onAttachedToWindow()
    }

    var isFocusedTab: Boolean = false

    companion object {
        const val TAG = "TabScreen"
    }
}
