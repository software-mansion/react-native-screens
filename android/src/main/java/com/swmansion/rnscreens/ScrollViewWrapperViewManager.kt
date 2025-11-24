package com.swmansion.rnscreens

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScrollViewWrapperManagerDelegate
import com.facebook.react.viewmanagers.RNSScrollViewWrapperManagerInterface

@ReactModule(name = ScrollViewWrapperViewManager.REACT_CLASS)
open class ScrollViewWrapperViewManager :
    ViewGroupManager<ScrollViewWrapper>(),
    RNSScrollViewWrapperManagerInterface<ScrollViewWrapper> {
    private val delegate: ViewManagerDelegate<ScrollViewWrapper>

    init {
        delegate = RNSScrollViewWrapperManagerDelegate<ScrollViewWrapper, ScrollViewWrapperViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = ScrollViewWrapper(reactContext)

    override fun getDelegate(): ViewManagerDelegate<ScrollViewWrapper> = delegate

    companion object {
        const val REACT_CLASS = "RNSScrollViewWrapper"
    }
}