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

    internal lateinit var eventEmitter: TabScreenEventEmitter

    override fun onAttachedToWindow() {
        Log.d(TAG, "TabScreen attached to window")
        super.onAttachedToWindow()
    }

    var isFocusedTab: Boolean = false

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabScreen must have its tag set when registering event emitters" }
        eventEmitter = TabScreenEventEmitter(reactContext, id)
    }

    companion object {
        const val TAG = "TabScreen"
    }
}
