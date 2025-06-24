package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerInterface

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

    override fun setTabBarItemBadgeBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) = Unit

    override fun setIsFocused(
        view: TabScreen,
        value: Boolean,
    ) {
        Log.d(REACT_CLASS, "setIsFocused $value")
        view.isFocusedTab = value
    }

    override fun setTabKey(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setBadgeValue(
        view: TabScreen?,
        value: String?,
    ) = Unit

//    override fun setBadgeColor(
//        view: TabScreen?,
//        value: Int?
//    ) = Unit
//
//    override fun setTitleFontSize(
//        view: TabScreen?,
//        value: Float
//    ) = Unit

    override fun setTitle(
        view: TabScreen?,
        value: String?,
    ) = Unit

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
