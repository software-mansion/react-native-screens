package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSTabsScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenWillDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.image.loadTabImage
import com.swmansion.rnscreens.utils.RNSLog

@ReactModule(name = TabsScreenViewManager.REACT_CLASS)
class TabsScreenViewManager :
    ViewGroupManager<TabsScreen>(),
    RNSTabsScreenManagerInterface<TabsScreen> {
    private val delegate: ViewManagerDelegate<TabsScreen> = RNSTabsScreenManagerDelegate<TabsScreen, TabsScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    var context: ThemedReactContext? = null

    override fun createViewInstance(reactContext: ThemedReactContext): TabsScreen {
        RNSLog.d(REACT_CLASS, "createViewInstance")
        return TabsScreen(reactContext)
    }

    override fun getDelegate() = delegate

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(TabsScreenWillAppearEvent),
            makeEventRegistrationInfo(TabsScreenDidAppearEvent),
            makeEventRegistrationInfo(TabsScreenWillDisappearEvent),
            makeEventRegistrationInfo(TabsScreenDidDisappearEvent),
        )

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: TabsScreen,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    // These should be ignored or another component, dedicated for Android should be used
    override fun setStandardAppearance(
        view: TabsScreen,
        value: Dynamic,
    ) = Unit

    override fun setScrollEdgeAppearance(
        view: TabsScreen,
        value: Dynamic,
    ) = Unit

    @ReactProp(name = "tabBarItemBadgeBackgroundColor", customType = "Color")
    override fun setTabBarItemBadgeBackgroundColor(
        view: TabsScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeBackgroundColor = value
    }

    override fun setIconType(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    override fun setIconImageSource(
        view: TabsScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setIconResourceName(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    override fun setSelectedIconImageSource(
        view: TabsScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setSelectedIconResourceName(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    // Annotation is Paper only
    @ReactProp(name = "isFocused")
    override fun setIsFocused(
        view: TabsScreen,
        value: Boolean,
    ) {
        RNSLog.d(REACT_CLASS, "TabsScreen [${view.id}] setIsFocused $value")
        view.isFocusedTab = value
    }

    @ReactProp(name = "tabKey")
    override fun setTabKey(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabKey = value
    }

    @ReactProp(name = "badgeValue")
    override fun setBadgeValue(
        view: TabsScreen,
        value: String?,
    ) {
        view.badgeValue = value
    }

    @ReactProp(name = "title")
    override fun setTitle(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabTitle = value
    }

    override fun setIsTitleUndefined(
        view: TabsScreen,
        value: Boolean,
    ) = Unit

    @ReactProp(name = "specialEffects")
    override fun setSpecialEffects(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        var scrollToTop = true
        var popToRoot = true
        if (value?.hasKey("repeatedTabSelection") ?: false) {
            value.getMap("repeatedTabSelection")?.let { repeatedTabSelectionConfig ->
                if (repeatedTabSelectionConfig.hasKey("scrollToTop")) {
                    scrollToTop =
                        repeatedTabSelectionConfig.getBoolean("scrollToTop")
                }
                if (repeatedTabSelectionConfig.hasKey("popToRoot")) {
                    popToRoot =
                        repeatedTabSelectionConfig.getBoolean("popToRoot")
                }
            }
        }
        view.shouldUseRepeatedTabSelectionPopToRootSpecialEffect = popToRoot
        view.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect = scrollToTop
    }

    override fun setOverrideScrollViewContentInsetAdjustmentBehavior(
        view: TabsScreen,
        value: Boolean,
    ) = Unit

    override fun setBottomScrollEdgeEffect(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    override fun setLeftScrollEdgeEffect(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    override fun setRightScrollEdgeEffect(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    override fun setTopScrollEdgeEffect(
        view: TabsScreen?,
        value: String?,
    ) = Unit

    @ReactProp(name = "tabBarItemTestID")
    override fun setTabBarItemTestID(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabBarItemTestID = value
    }

    @ReactProp(name = "tabBarItemAccessibilityLabel")
    override fun setTabBarItemAccessibilityLabel(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabBarItemAccessibilityLabel = value
    }

    // Android specific
    @ReactProp(name = "tabBarItemBadgeTextColor", customType = "Color")
    override fun setTabBarItemBadgeTextColor(
        view: TabsScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeTextColor = value
    }

    @ReactProp(name = "drawableIconResourceName")
    override fun setDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.drawableIconResourceName = value
    }

    override fun setOrientation(
        view: TabsScreen,
        value: String?,
    ) = Unit

    override fun setSystemItem(
        view: TabsScreen,
        value: String?,
    ) = Unit

    override fun setUserInterfaceStyle(
        view: TabsScreen,
        value: String?,
    ) = Unit

    @ReactProp(name = "imageIconResource")
    override fun setImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            loadTabImage(view.context, uri, view)
        }
    }

    companion object {
        const val REACT_CLASS = "RNSTabsScreen"
    }
}
