package com.swmansion.rnscreens.safearea

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerDelegate
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerInterface

@ReactModule(name = SafeAreaViewManager.REACT_CLASS)
class SafeAreaViewManager :
    ViewGroupManager<SafeAreaView>(),
    RNSSafeAreaViewManagerInterface<SafeAreaView> {
    private val delegate: ViewManagerDelegate<SafeAreaView> = RNSSafeAreaViewManagerDelegate<SafeAreaView, SafeAreaViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): SafeAreaView = SafeAreaView(reactContext)

    override fun setEdges(
        view: SafeAreaView,
        value: ReadableMap?,
    ): Unit = Unit

    companion object {
        const val REACT_CLASS = "RNSSafeAreaView"
    }
}
