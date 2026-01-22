package com.swmansion.rnscreens.gamma.stack.host

import android.view.View
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHostManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHostManagerInterface
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

@ReactModule(name = StackHostViewManager.REACT_CLASS)
class StackHostViewManager :
    ViewGroupManager<StackHost>(),
    RNSStackHostManagerInterface<StackHost> {
    private val delegate: ViewManagerDelegate<StackHost> = RNSStackHostManagerDelegate<StackHost, StackHostViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext) = StackHost(reactContext)

    override fun addView(
        parent: StackHost,
        child: View,
        index: Int,
    ) {
        require(child is StackScreen) { "[RNScreens] Attempt to attach child that is not of type ${StackScreen::javaClass.name}" }
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(
        parent: StackHost,
        view: View,
    ) {
        require(view is StackScreen) { "[RNScreens] Attempt to attach child that is not of type ${StackScreen::javaClass.name}" }
        parent.unmountReactSubview(view)
    }

    override fun removeViewAt(
        parent: StackHost,
        index: Int,
    ) {
        parent.unmountReactSubviewAt(index)
    }

    override fun removeAllViews(parent: StackHost) {
        parent.unmountAllReactSubviews()
    }

    override fun getChildAt(
        parent: StackHost,
        index: Int,
    ): View? = parent.renderedScreens.getOrNull(index)

    override fun getChildCount(parent: StackHost): Int = parent.renderedScreens.size

    companion object {
        const val REACT_CLASS = "RNSStackHost"
    }
}
