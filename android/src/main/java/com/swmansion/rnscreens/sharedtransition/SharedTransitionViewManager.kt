package com.swmansion.rnscreens.sharedtransition

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = SharedTransitionViewManager.REACT_CLASS)
class SharedTransitionViewManager : ViewGroupManager<SharedTransitionView>() {

    companion object {
        const val REACT_CLASS = "RNSSharedTransitionView"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): SharedTransitionView {
        return SharedTransitionView(reactContext)
    }

    @ReactProp(name = "sharedTransitionTag")
    fun setSharedTransitionTag(view: SharedTransitionView, tag: String?) {
        view.sharedTransitionTag = tag
    }
}
