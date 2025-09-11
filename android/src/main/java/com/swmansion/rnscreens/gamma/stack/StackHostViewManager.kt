package com.swmansion.rnscreens.gamma.stack

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackHostManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackHostManagerInterface

@ReactModule(name = StackHostViewManager.REACT_CLASS)
class StackHostViewManager : ViewGroupManager<StackHost>(), RNSScreenStackHostManagerInterface<StackHost> {
    private val delegate: ViewManagerDelegate<StackHost> = RNSScreenStackHostManagerDelegate<StackHost, StackHostViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext) = StackHost(reactContext)

    companion object {
        const val REACT_CLASS = "RNSScreenStackHost"
    }
}