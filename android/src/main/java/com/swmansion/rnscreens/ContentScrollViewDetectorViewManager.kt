package com.swmansion.rnscreens

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSContentScrollViewDetectorManagerDelegate
import com.facebook.react.viewmanagers.RNSContentScrollViewDetectorManagerInterface

@ReactModule(name = ContentScrollViewDetectorViewManager.REACT_CLASS)
open class ContentScrollViewDetectorViewManager :
    ViewGroupManager<ContentScrollViewDetector>(),
    RNSContentScrollViewDetectorManagerInterface<ContentScrollViewDetector> {
    private val delegate: ViewManagerDelegate<ContentScrollViewDetector>

    init {
        delegate =
            RNSContentScrollViewDetectorManagerDelegate<ContentScrollViewDetector, ContentScrollViewDetectorViewManager>(
                this,
            )
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = ContentScrollViewDetector(reactContext)

    override fun getDelegate(): ViewManagerDelegate<ContentScrollViewDetector> = delegate

    companion object Companion {
        const val REACT_CLASS = "RNSContentScrollViewDetector"
    }
}
