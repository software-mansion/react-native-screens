package com.swmansion.rnscreens.fullwindowoverlay

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerInterface

@ReactModule(name = FullWindowOverlayViewManager.REACT_CLASS)
class FullWindowOverlayViewManager : ViewGroupManager<FullWindowOverlay>(),
    RNSFullWindowOverlayManagerInterface<FullWindowOverlay> {

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext) = FullWindowOverlay(context)

    companion object {
        const val REACT_CLASS = "RNSFullWindowOverlay"
    }
}