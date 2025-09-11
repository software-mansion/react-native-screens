package com.swmansion.rnscreens.gamma.stack

import android.view.View
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

    override fun addView(parent: StackHost, child: View, index: Int) {
        require(child is StackScreen) { "[RNScreens] Attempt to attach child that is not of type ${StackScreen::javaClass.name}" }
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(parent: StackHost, child: View) {
        require(child is StackScreen) { "[RNScreens] Attempt to attach child that is not of type ${StackScreen::javaClass.name}" }
        parent.unmountReactSubview(child)
    }

    override fun removeViewAt(parent: StackHost, index: Int) {
        parent.unmountReactSubviewAt(index)
    }

    override fun removeAllViews(parent: StackHost) {
        parent.unmountAllReactSubviews()
    }

    companion object {
        const val REACT_CLASS = "RNSScreenStackHost"
    }
}