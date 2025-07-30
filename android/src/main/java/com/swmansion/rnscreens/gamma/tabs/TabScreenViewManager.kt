package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillDisappearEvent

@ReactModule(name = TabScreenViewManager.REACT_CLASS)
class TabScreenViewManager :
    ViewGroupManager<TabScreen>(),
    RNSBottomTabsScreenManagerInterface<TabScreen> {
    private val delegate: ViewManagerDelegate<TabScreen> = RNSBottomTabsScreenManagerDelegate<TabScreen, TabScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): TabScreen {
        Log.d(REACT_CLASS, "createViewInstance")
        return TabScreen(reactContext)
    }

    override fun getDelegate() = delegate

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(TabScreenWillAppearEvent),
            makeEventRegistrationInfo(TabScreenDidAppearEvent),
            makeEventRegistrationInfo(TabScreenWillDisappearEvent),
            makeEventRegistrationInfo(TabScreenDidDisappearEvent),
        )

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: TabScreen,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    // These should be ignored or another component, dedicated for Android should be used

    override fun setTabBarBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) = Unit

    override fun setTabBarBlurEffect(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontFamily(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontSize(
        view: TabScreen,
        value: Float,
    ) = Unit

    override fun setTabBarItemTitleFontWeight(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontStyle(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontColor(
        view: TabScreen,
        value: Int?,
    ) = Unit

    @ReactProp(name = "tabBarItemBadgeBackgroundColor", customType = "Color")
    override fun setTabBarItemBadgeBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeBackgroundColor = value
    }

    override fun setTabBarItemTitlePositionAdjustment(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setTabBarItemIconColor(
        view: TabScreen?,
        value: Int?,
    ) = Unit

    override fun setIconType(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setIconSfSymbolName(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setSelectedIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setSelectedIconSfSymbolName(
        view: TabScreen?,
        value: String?,
    ) = Unit

    // Annotation is Paper only
    @ReactProp(name = "isFocused")
    override fun setIsFocused(
        view: TabScreen,
        value: Boolean,
    ) {
        Log.d(REACT_CLASS, "TabScreen [${view.id}] setIsFocused $value")
        view.isFocusedTab = value
    }

    @ReactProp(name = "tabKey")
    override fun setTabKey(
        view: TabScreen,
        value: String?,
    ) {
        view.tabKey = value
    }

    @ReactProp(name = "badgeValue")
    override fun setBadgeValue(
        view: TabScreen,
        value: String?,
    ) {
        view.badgeValue = value
    }

    @ReactProp(name = "title")
    override fun setTitle(
        view: TabScreen,
        value: String?,
    ) {
        view.tabTitle = value
    }

    override fun setSpecialEffects(
        view: TabScreen,
        value: ReadableMap?,
    ) = Unit

    override fun setOverrideScrollViewContentInsetAdjustmentBehavior(
        view: TabScreen,
        value: Boolean,
    ) = Unit

    // Android specific
    @ReactProp(name = "tabBarItemBadgeTextColor", customType = "Color")
    override fun setTabBarItemBadgeTextColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeTextColor = value
    }

    @ReactProp(name = "iconResourceName")
    override fun setIconResourceName(
        view: TabScreen,
        value: String?,
    ) {
        view.iconResourceName = value
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
