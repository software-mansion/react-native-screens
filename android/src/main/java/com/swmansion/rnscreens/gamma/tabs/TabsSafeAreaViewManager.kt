package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.CxxCallbackImpl
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsSafeAreaViewManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsSafeAreaViewManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.event.TabsSafeAreaViewNativeLayoutEvent

@ReactModule(name = TabsSafeAreaViewManager.REACT_CLASS)
class TabsSafeAreaViewManager : ViewGroupManager<TabsSafeAreaView>(), RNSTabsSafeAreaViewManagerInterface<TabsSafeAreaView> {
    private val delegate: ViewManagerDelegate<TabsSafeAreaView> =
        RNSTabsSafeAreaViewManagerDelegate<TabsSafeAreaView, TabsSafeAreaViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): TabsSafeAreaView =
        TabsSafeAreaView(reactContext)

    override fun addEventEmitters(reactContext: ThemedReactContext, view: TabsSafeAreaView) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(TabsSafeAreaViewNativeLayoutEvent)
        )

    companion object {
        const val REACT_CLASS = "RNSTabsSafeAreaView"
    }
}