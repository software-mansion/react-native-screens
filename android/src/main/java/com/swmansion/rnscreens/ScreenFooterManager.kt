package com.swmansion.rnscreens

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenFooterManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenFooterManagerInterface

@ReactModule(name = ScreenFooterManager.REACT_CLASS)
class ScreenFooterManager :
    ViewGroupManager<ScreenFooter>(),
    RNSScreenFooterManagerInterface<ScreenFooter> {
    private val delegate: ViewManagerDelegate<ScreenFooter> = RNSScreenFooterManagerDelegate(this)

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext) = ScreenFooter(context)

    override fun getDelegate(): ViewManagerDelegate<ScreenFooter> = delegate

    companion object {
        const val REACT_CLASS = "RNSScreenFooter"
    }
}
