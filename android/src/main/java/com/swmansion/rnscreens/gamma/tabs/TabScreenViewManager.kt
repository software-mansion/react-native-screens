package com.swmansion.rnscreens.gamma.tabs

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Dynamic
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
import com.swmansion.rnscreens.gamma.tabs.image.loadTabImage
import com.swmansion.rnscreens.utils.RNSLog

@ReactModule(name = TabScreenViewManager.REACT_CLASS)
class TabScreenViewManager :
    ViewGroupManager<TabScreen>(),
    RNSBottomTabsScreenManagerInterface<TabScreen> {
    private val delegate: ViewManagerDelegate<TabScreen> = RNSBottomTabsScreenManagerDelegate<TabScreen, TabScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    var context: ThemedReactContext? = null

    override fun createViewInstance(reactContext: ThemedReactContext): TabScreen {
        RNSLog.d(REACT_CLASS, "createViewInstance")
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
    override fun setStandardAppearance(
        view: TabScreen,
        value: Dynamic,
    ) = Unit

    override fun setScrollEdgeAppearance(
        view: TabScreen,
        value: Dynamic,
    ) = Unit

    @ReactProp(name = "tabBarItemBadgeBackgroundColor", customType = "Color")
    override fun setTabBarItemBadgeBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeBackgroundColor = value
    }

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
        RNSLog.d(REACT_CLASS, "TabScreen [${view.id}] setIsFocused $value")
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

    override fun setBottomScrollEdgeEffect(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setLeftScrollEdgeEffect(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setRightScrollEdgeEffect(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setTopScrollEdgeEffect(
        view: TabScreen?,
        value: String?,
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

    override fun setOrientation(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setSystemItem(
        view: TabScreen,
        value: String?,
    ) = Unit

    @ReactProp(name = "iconResource")
    override fun setIconResource(
        view: TabScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            val context = view.context
            loadTabImage(context, uri) { drawable ->
                // Since image loading might happen on a background thread
                // ref. https://frescolib.org/docs/intro-image-pipeline.html
                // We should schedule rendering the result on the UI thread
                Handler(Looper.getMainLooper()).post {
                    view.icon = drawable
                }
            }
        }
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
