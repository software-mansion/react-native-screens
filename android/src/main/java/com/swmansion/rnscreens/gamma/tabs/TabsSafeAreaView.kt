package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

class TabsSafeAreaView(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
    internal lateinit var eventEmitter: TabsSafeAreaViewEventEmitter

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        if (this::eventEmitter.isInitialized) {
            Log.d("TabsSafeAreaView", "emitting on native layout event")
            eventEmitter.emitOnNativeLayout(100)
        }
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabsHost must have its tag set when registering event emitters" }
        eventEmitter = TabsSafeAreaViewEventEmitter(reactContext, id)
    }
}
