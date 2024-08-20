package com.swmansion.rnscreens

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenContentWrapperManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenContentWrapperManagerInterface

@ReactModule(name = ScreenContentWrapperManager.REACT_CLASS)
class ScreenContentWrapperManager :
    ViewGroupManager<ScreenContentWrapper>(),
    RNSScreenContentWrapperManagerInterface<ScreenContentWrapper> {
    private val delegate: ViewManagerDelegate<ScreenContentWrapper> = RNSScreenContentWrapperManagerDelegate(this)

    companion object {
        const val REACT_CLASS = "RNSScreenContentWrapper"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): ScreenContentWrapper = ScreenContentWrapper(reactContext)

    override fun getDelegate(): ViewManagerDelegate<ScreenContentWrapper> = delegate
}
