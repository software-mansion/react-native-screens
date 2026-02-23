package com.swmansion.rnscreens.gamma.scrollviewmarker

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScrollViewMarkerManagerDelegate
import com.facebook.react.viewmanagers.RNSScrollViewMarkerManagerInterface

@ReactModule(name = ScrollViewMarkerViewManager.REACT_CLASS)
class ScrollViewMarkerViewManager :
    ViewGroupManager<ScrollViewMarker>(),
    RNSScrollViewMarkerManagerInterface<ScrollViewMarker> {
    private val delegate: ViewManagerDelegate<ScrollViewMarker> =
        RNSScrollViewMarkerManagerDelegate<ScrollViewMarker, ScrollViewMarkerViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext): ScrollViewMarker = ScrollViewMarker(reactContext)

    // iOS only
    override fun setLeftScrollEdgeEffect(
        view: ScrollViewMarker?,
        value: String?,
    ) = Unit

    // iOS only
    override fun setTopScrollEdgeEffect(
        view: ScrollViewMarker?,
        value: String?,
    ) = Unit

    // iOS only
    override fun setRightScrollEdgeEffect(
        view: ScrollViewMarker?,
        value: String?,
    ) = Unit

    // iOS only
    override fun setBottomScrollEdgeEffect(
        view: ScrollViewMarker?,
        value: String?,
    ) = Unit

    companion object {
        const val REACT_CLASS = "RNSScrollViewMarker"
    }
}
