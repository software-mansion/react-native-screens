package com.swmansion.rnscreens.gamma.tabs.screen

import android.util.Log
import androidx.core.graphics.toColorInt
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSTabsScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.appearance.ItemStateAppearance
import com.swmansion.rnscreens.gamma.tabs.appearance.TabsAppearance
import com.swmansion.rnscreens.gamma.tabs.image.loadTabImage
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenViewManager.Companion.TAG
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenWillDisappearEvent
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

    @ReactProp(name = "drawableIconResourceName")
    override fun setDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.drawableIconResourceName = value
    }

    @ReactProp(name = "selectedDrawableIconResourceName")
    override fun setSelectedDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.selectedDrawableIconResourceName = value
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
            loadTabImage(view.context, uri, view, false)
        }
    }

    @ReactProp(name = "selectedImageIconResource")
    override fun setSelectedImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            loadTabImage(view.context, uri, view, true)
        }
    }

    @ReactProp(name = "standardAppearanceAndroid")
    override fun setStandardAppearanceAndroid(
        view: TabsScreen,
        value: Dynamic?,
    ) {
        if (value == null || value.isNull) {
            view.appearance = null
            return
        }
        val appearanceMap = if (value.type == ReadableType.Map) value.asMap() else null

        if (appearanceMap == null) {
            view.appearance = null
            return
        }

        view.appearance = parseAndroidTabsAppearance(appearanceMap)
    }

    private fun parseAndroidTabsAppearance(appearance: ReadableMap): TabsAppearance =
        TabsAppearance(
            tabBarBackgroundColor = appearance.getOptionalColor("tabBarBackgroundColor"),
            tabBarItemRippleColor = appearance.getOptionalColor("tabBarItemRippleColor"),
            tabBarItemLabelVisibilityMode = appearance.getOptionalString("tabBarItemLabelVisibilityMode"),
            normal = if (appearance.hasKey("normal")) parseItemStateAppearance(appearance.getMap("normal")) else null,
            selected = if (appearance.hasKey("selected")) parseItemStateAppearance(appearance.getMap("selected")) else null,
            focused = if (appearance.hasKey("focused")) parseItemStateAppearance(appearance.getMap("focused")) else null,
            disabled = if (appearance.hasKey("disabled")) parseItemStateAppearance(appearance.getMap("disabled")) else null,
            tabBarItemActiveIndicatorColor = appearance.getOptionalColor("tabBarItemActiveIndicatorColor"),
            tabBarItemActiveIndicatorEnabled = appearance.getOptionalBoolean("tabBarItemActiveIndicatorEnabled"),
            tabBarItemTitleFontFamily = appearance.getOptionalString("tabBarItemTitleFontFamily"),
            tabBarItemTitleSmallLabelFontSize = appearance.getOptionalFloat("tabBarItemTitleSmallLabelFontSize"),
            tabBarItemTitleLargeLabelFontSize = appearance.getOptionalFloat("tabBarItemTitleLargeLabelFontSize"),
            tabBarItemTitleFontWeight = appearance.getOptionalString("tabBarItemTitleFontWeight"),
            tabBarItemTitleFontStyle = appearance.getOptionalString("tabBarItemTitleFontStyle"),
            tabBarItemBadgeBackgroundColor = appearance.getOptionalColor("tabBarItemBadgeBackgroundColor"),
            tabBarItemBadgeTextColor = appearance.getOptionalColor("tabBarItemBadgeTextColor"),
        )

    private fun parseItemStateAppearance(itemStateAppearance: ReadableMap?): ItemStateAppearance? {
        if (itemStateAppearance == null) return null
        return ItemStateAppearance(
            tabBarItemIconColor = itemStateAppearance.getOptionalColor("tabBarItemIconColor"),
            tabBarItemTitleFontColor = itemStateAppearance.getOptionalColor("tabBarItemTitleFontColor"),
        )
    }

    companion object {
        const val REACT_CLASS = "RNSTabsScreen"
        const val TAG = "TabsScreenViewManager"
    }
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

private fun ReadableMap.getOptionalColor(key: String): Int? {
    if (!hasKey(key) || isNull(key)) return null
    return try {
        when (getType(key)) {
            ReadableType.Number -> getInt(key)
            ReadableType.String -> getString(key)?.toColorInt()
            else -> null
        }
    } catch (e: Exception) {
        Log.w(TAG, "[RNScreens] Could not parse color for key '$key': ${e.message}")
        null
    }
}
