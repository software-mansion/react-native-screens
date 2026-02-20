package com.swmansion.rnscreens.gamma.tabs

import android.view.View
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSBottomTabsManagerDelegate
import com.facebook.react.viewmanagers.RNSBottomTabsManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.event.TabsHostNativeFocusChangeEvent

@ReactModule(name = TabsHostViewManager.REACT_CLASS)
class TabsHostViewManager :
    ViewGroupManager<TabsHost>(),
    RNSBottomTabsManagerInterface<TabsHost> {
    private val delegate: ViewManagerDelegate<TabsHost> = RNSBottomTabsManagerDelegate<TabsHost, TabsHostViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = TabsHost(reactContext)

    protected override fun getDelegate(): ViewManagerDelegate<TabsHost> = delegate

    override fun addView(
        parent: TabsHost,
        child: View,
        index: Int,
    ) {
        require(child is TabScreen) { "[RNScreens] Attempt to attach child that is not of type ${TabScreen::javaClass.name}" }
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(
        parent: TabsHost,
        child: View,
    ) {
        require(child is TabScreen) { "[RNScreens] Attempt to detach child that is not of type ${TabScreen::javaClass.name}" }
        parent.unmountReactSubview(child)
    }

    override fun removeViewAt(
        parent: TabsHost,
        index: Int,
    ) {
        parent.unmountReactSubviewAt(index)
    }

    override fun removeAllViews(parent: TabsHost) {
        parent.unmountAllReactSubviews()
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(TabsHostNativeFocusChangeEvent),
        )

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: TabsHost,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    // These should be ignored or another component, dedicated for Android should be used

    override fun setTabBarTintColor(
        view: TabsHost,
        value: Int?,
    ) = Unit

    override fun setControlNavigationStateInJS(
        view: TabsHost?,
        value: Boolean,
    ) = Unit

    override fun setTabBarMinimizeBehavior(
        view: TabsHost,
        value: String?,
    ) = Unit

    override fun setTabBarControllerMode(
        view: TabsHost,
        value: String?,
    ) = Unit

    @ReactProp(name = "tabBarHidden")
    override fun setTabBarHidden(
        view: TabsHost,
        value: Boolean,
    ) {
        view.tabBarHidden = value
    }

    @ReactProp(name = "nativeContainerBackgroundColor", customType = "Color")
    override fun setNativeContainerBackgroundColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.nativeContainerBackgroundColor = value
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabs"
    }
}
