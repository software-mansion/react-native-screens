package com.swmansion.rnscreens.gamma.tabs

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.ext.parentAsView

@SuppressLint("ViewConstructor") // Should never be recreated
class TabsSafeAreaView(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
    internal lateinit var eventEmitter: TabsSafeAreaViewEventEmitter

    private val parentScreen: TabScreen?
        get() = (this.parent as? TabScreen)

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        Log.d("TabsSafeAreaView", "emitting on native layout event")
        eventEmitter.emitOnNativeLayout(100)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] ${TabsSafeAreaView::class.simpleName} must have its tag set when registering event emitters" }
        eventEmitter = TabsSafeAreaViewEventEmitter(reactContext, id)
    }
}
