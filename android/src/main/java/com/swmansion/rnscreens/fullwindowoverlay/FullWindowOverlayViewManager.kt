package com.swmansion.rnscreens.fullwindowoverlay

import android.view.View
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerInterface

@ReactModule(name = FullWindowOverlayViewManager.REACT_CLASS)
class FullWindowOverlayViewManager : ViewGroupManager<FullWindowOverlay>(),
    RNSFullWindowOverlayManagerInterface<FullWindowOverlay> {

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext) = FullWindowOverlay(context)

    override fun addView(parent: FullWindowOverlay, child: View, index: Int) {
        parent.onAddView(child, index)
    }

    override fun removeViewAt(parent: FullWindowOverlay, index: Int) {
        parent.onRemoveViewAt(index)
    }

    override fun getChildCount(parent: FullWindowOverlay): Int = parent.hostView.childCount

    override fun getChildAt(parent: FullWindowOverlay, index: Int): View? = parent.hostView.getChildAt(index)

    companion object {
        const val REACT_CLASS = "RNSFullWindowOverlay"
    }
}
