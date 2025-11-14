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

    @ReactProp(name = "tabBarBackgroundColor", customType = "Color")
    override fun setTabBarBackgroundColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarBackgroundColor = value
    }

    override fun setTabBarTintColor(
        view: TabsHost,
        value: Int?,
    ) = Unit

    @ReactProp(name = "tabBarItemTitleFontSize")
    override fun setTabBarItemTitleFontSize(
        view: TabsHost?,
        value: Float,
    ) {
        view?.tabBarItemTitleFontSize = value
    }

    override fun setControlNavigationStateInJS(
        view: TabsHost?,
        value: Boolean,
    ) = Unit

    @ReactProp(name = "tabBarItemTitleFontFamily")
    override fun setTabBarItemTitleFontFamily(
        view: TabsHost,
        value: String?,
    ) {
        view.tabBarItemTitleFontFamily = value
    }

    @ReactProp(name = "tabBarItemTitleFontWeight")
    override fun setTabBarItemTitleFontWeight(
        view: TabsHost,
        value: String?,
    ) {
        view.tabBarItemTitleFontWeight = value
    }

    @ReactProp(name = "tabBarItemTitleFontStyle")
    override fun setTabBarItemTitleFontStyle(
        view: TabsHost,
        value: String?,
    ) {
        view.tabBarItemTitleFontStyle = value
    }

    @ReactProp(name = "tabBarItemTitleFontColor", customType = "Color")
    override fun setTabBarItemTitleFontColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemTitleFontColor = value
    }

    @ReactProp(name = "tabBarItemIconColor", customType = "Color")
    override fun setTabBarItemIconColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemIconColor = value
    }

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

    // Android additional

    @ReactProp(name = "tabBarItemTitleFontColorActive", customType = "Color")
    override fun setTabBarItemTitleFontColorActive(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemTitleFontColorActive = value
    }

    @ReactProp(name = "tabBarItemActiveIndicatorColor", customType = "Color")
    override fun setTabBarItemActiveIndicatorColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemActiveIndicatorColor = value
    }

    @ReactProp(name = "tabBarItemActiveIndicatorEnabled")
    override fun setTabBarItemActiveIndicatorEnabled(
        view: TabsHost,
        value: Boolean,
    ) {
        view.isTabBarItemActiveIndicatorEnabled = value
    }

    @ReactProp(name = "tabBarItemIconColorActive", customType = "Color")
    override fun setTabBarItemIconColorActive(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemIconColorActive = value
    }

    @ReactProp(name = "tabBarItemTitleFontSizeActive")
    override fun setTabBarItemTitleFontSizeActive(
        view: TabsHost?,
        value: Float,
    ) {
        view?.tabBarItemTitleFontSizeActive = value
    }

    @ReactProp(name = "tabBarItemRippleColor", customType = "Color")
    override fun setTabBarItemRippleColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.tabBarItemRippleColor = value
    }

    @ReactProp(name = "tabBarItemLabelVisibilityMode")
    override fun setTabBarItemLabelVisibilityMode(
        view: TabsHost,
        value: String?,
    ) {
        view.tabBarItemLabelVisibilityMode = value
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabs"
    }
}
