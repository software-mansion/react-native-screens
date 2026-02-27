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
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.appearance.ActiveIndicatorAppearance
import com.swmansion.rnscreens.gamma.tabs.appearance.AndroidTabsAppearance
import com.swmansion.rnscreens.gamma.tabs.appearance.BadgeAppearance
import com.swmansion.rnscreens.gamma.tabs.appearance.BottomNavItemColors
import com.swmansion.rnscreens.gamma.tabs.appearance.ItemStateColors
import com.swmansion.rnscreens.gamma.tabs.appearance.TypographyAppearance
import com.swmansion.rnscreens.gamma.tabs.image.loadTabImage
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.screen.event.TabsScreenWillDisappearEvent
import com.swmansion.rnscreens.utils.RNSLog

@ReactModule(name = TabsScreenViewManager.REACT_CLASS)
class TabsScreenViewManager :
    ViewGroupManager<TabsScreen>(),
    RNSTabsScreenAndroidManagerInterface<TabsScreen> {
    private val delegate: ViewManagerDelegate<TabsScreen> = RNSTabsScreenAndroidManagerDelegate<TabsScreen, TabsScreenViewManager>(this)

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

    @ReactProp(name = "standardAppearance")
    override fun setStandardAppearance(
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

    private fun parseAndroidTabsAppearance(appearance: ReadableMap): AndroidTabsAppearance =
        AndroidTabsAppearance(
            backgroundColor = appearance.getOptionalColor("tabBarBackgroundColor"),
            itemRippleColor = appearance.getOptionalColor("tabBarItemRippleColor"),
            labelVisibilityMode = appearance.getOptionalString("tabBarItemLabelVisibilityMode"),
            itemColors = if (appearance.hasKey("itemColors")) parseBottomNavItemAppearanceStates(appearance.getMap("itemColors")) else null,
            activeIndicator =
                if (appearance.hasKey(
                        "activeIndicator",
                    )
                ) {
                    parseActiveIndicator(appearance.getMap("activeIndicator"))
                } else {
                    null
                },
            typography = if (appearance.hasKey("typography")) parseTypography(appearance.getMap("typography")) else null,
            badge = if (appearance.hasKey("badge")) parseBadge(appearance.getMap("badge")) else null,
        )

    private fun parseBottomNavItemAppearanceStates(appearanceStates: ReadableMap?): BottomNavItemColors? {
        if (appearanceStates == null) return null
        return BottomNavItemColors(
            normal = if (appearanceStates.hasKey("normal")) parseItemStateColors(appearanceStates.getMap("normal")) else null,
            selected = if (appearanceStates.hasKey("selected")) parseItemStateColors(appearanceStates.getMap("selected")) else null,
            focused = if (appearanceStates.hasKey("focused")) parseItemStateColors(appearanceStates.getMap("focused")) else null,
            disabled = if (appearanceStates.hasKey("disabled")) parseItemStateColors(appearanceStates.getMap("disabled")) else null,
        )
    }

    private fun parseItemStateColors(stateColors: ReadableMap?): ItemStateColors? {
        if (stateColors == null) return null
        return ItemStateColors(
            titleColor = stateColors.getOptionalColor("titleColor"),
            iconColor = stateColors.getOptionalColor("iconColor"),
        )
    }

    private fun parseActiveIndicator(activeIndicatorConfig: ReadableMap?): ActiveIndicatorAppearance? {
        if (activeIndicatorConfig == null) return null
        return ActiveIndicatorAppearance(
            color = activeIndicatorConfig.getOptionalColor("color"),
            enabled = activeIndicatorConfig.getOptionalBoolean("enabled"),
        )
    }

    private fun parseTypography(typographyConfig: ReadableMap?): TypographyAppearance? {
        if (typographyConfig == null) return null
        return TypographyAppearance(
            fontFamily = typographyConfig.getOptionalString("fontFamily"),
            fontSizeSmall = typographyConfig.getOptionalFloat("fontSizeSmall"),
            fontSizeLarge = typographyConfig.getOptionalFloat("fontSizeLarge"),
            fontWeight = typographyConfig.getOptionalString("fontWeight"),
            fontStyle = typographyConfig.getOptionalString("fontStyle"),
        )
    }

    private fun parseBadge(badgeConfig: ReadableMap?): BadgeAppearance? {
        if (badgeConfig == null) return null
        return BadgeAppearance(
            backgroundColor = badgeConfig.getOptionalColor("backgroundColor"),
            textColor = badgeConfig.getOptionalColor("textColor"),
        )
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
            Log.w("RNScreens", "[RNScreens] Could not parse color for key '$key': ${e.message}")
            null
        }
    }

    companion object {
        const val REACT_CLASS = "RNSTabsScreenAndroid"
    }
}
