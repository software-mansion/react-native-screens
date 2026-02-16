package com.swmansion.rnscreens.gamma.tabs

import android.graphics.Color
import android.util.Log
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
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

    override fun setIconType(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setIconResourceName(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setSelectedIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setSelectedIconResourceName(
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

    override fun setIsTitleUndefined(
        view: TabScreen,
        value: Boolean,
    ) = Unit

    @ReactProp(name = "specialEffects")
    override fun setSpecialEffects(
        view: TabScreen,
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

    @ReactProp(name = "tabBarItemTestID")
    override fun setTabBarItemTestID(
        view: TabScreen,
        value: String?,
    ) {
        view.tabBarItemTestID = value
    }

    @ReactProp(name = "tabBarItemAccessibilityLabel")
    override fun setTabBarItemAccessibilityLabel(
        view: TabScreen,
        value: String?,
    ) {
        view.tabBarItemAccessibilityLabel = value
    }

    // Android specific

    @ReactProp(name = "drawableIconResourceName")
    override fun setDrawableIconResourceName(
        view: TabScreen,
        value: String?,
    ) {
        view.drawableIconResourceName = value
    }

    override fun setOrientation(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setSystemItem(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setUserInterfaceStyle(
        view: TabScreen,
        value: String?,
    ) = Unit

    @ReactProp(name = "imageIconResource")
    override fun setImageIconResource(
        view: TabScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            loadTabImage(view.context, uri, view)
        }
    }

    @ReactProp(name = "standardAppearanceAndroid")
    override fun setStandardAppearanceAndroid(
        view: TabScreen,
        value: Dynamic?,
    ) {
        if (value == null || value.isNull) {
            view.appearance = null
            return
        }
        val map = if (value.type == ReadableType.Map) value.asMap() else null

        if (map == null) {
            view.appearance = null
            return
        }

        view.appearance = parseAndroidTabsAppearance(map)
    }

    private fun ReadableMap.getOptionalBoolean(key: String): Boolean? {
        if (!hasKey(key) || isNull(key)) return null
        return if (getType(key) == ReadableType.Boolean) getBoolean(key) else null
    }

    private fun ReadableMap.getOptionalString(key: String): String? {
        if (!hasKey(key) || isNull(key)) return null
        return if (getType(key) == ReadableType.String) getString(key) else null
    }

    private fun ReadableMap.getOptionalFloat(key: String): Float? {
        if (!hasKey(key) || isNull(key)) return null
        return if (getType(key) == ReadableType.Number) getDouble(key).toFloat() else null
    }

    /**
     * Safely retrieves a Color.
     * Supports both Integer (processed color) and String (hex/name) values.
     */
    private fun ReadableMap.getOptionalColor(key: String): Int? {
        if (!hasKey(key) || isNull(key)) return null

        return try {
            when (getType(key)) {
                ReadableType.Number -> getInt(key)
                ReadableType.String -> Color.parseColor(getString(key))
                else -> null
            }
        } catch (e: Exception) {
            Log.w(REACT_CLASS, "[RNScreens] Could not parse color for key '$key': ${e.message}")
            null
        }
    }

    private fun parseAndroidTabsAppearance(map: ReadableMap): AndroidTabsAppearance =
        AndroidTabsAppearance(
            normal = if (map.hasKey("normal")) parseStateAppearance(map.getMap("normal")) else null,
            selected = if (map.hasKey("selected")) parseStateAppearance(map.getMap("selected")) else null,
            focused = if (map.hasKey("focused")) parseStateAppearance(map.getMap("focused")) else null,
            disabled = if (map.hasKey("disabled")) parseStateAppearance(map.getMap("disabled")) else null,

            tabBarBackgroundColor = map.getOptionalColor("tabBarBackgroundColor"),
            tabBarItemRippleColor = map.getOptionalColor("tabBarItemRippleColor"),
            tabBarItemActiveIndicatorColor = map.getOptionalColor("tabBarItemActiveIndicatorColor"),
            tabBarItemActiveIndicatorEnabled = map.getOptionalBoolean(key = "tabBarItemActiveIndicatorEnabled"),
            tabBarItemLabelVisibilityMode = map.getOptionalString("tabBarItemLabelVisibilityMode"),
        )

    private fun parseStateAppearance(map: ReadableMap?): AndroidTabsScreenItemStateAppearance? {
        if (map == null) return null
        return AndroidTabsScreenItemStateAppearance(
            tabBarItemTitleFontFamily = map.getOptionalString("tabBarItemTitleFontFamily"),
            tabBarItemTitleFontSize = map.getOptionalFloat("tabBarItemTitleFontSize"),
            tabBarItemTitleFontWeight = map.getOptionalString("tabBarItemTitleFontWeight"),
            tabBarItemTitleFontStyle = map.getOptionalString("tabBarItemTitleFontStyle"),
            tabBarItemTitleFontColor = map.getOptionalColor("tabBarItemTitleFontColor"),
            tabBarItemIconColor = map.getOptionalColor("tabBarItemIconColor"),
            tabBarItemBadgeBackgroundColor = map.getOptionalColor("tabBarItemBadgeBackgroundColor"),
            tabBarItemBadgeTextColor = map.getOptionalColor("tabBarItemBadgeTextColor"),
        )
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
