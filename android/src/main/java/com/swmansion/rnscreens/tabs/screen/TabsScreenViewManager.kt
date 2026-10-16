package com.swmansion.rnscreens.tabs.screen

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerInterface
import com.swmansion.rnscreens.core.utils.RNSLog
import com.swmansion.rnscreens.react.utils.makeEventRegistrationInfo
import com.swmansion.rnscreens.react.utils.readOptionalBoolean
import com.swmansion.rnscreens.react.utils.readOptionalColor
import com.swmansion.rnscreens.react.utils.readOptionalFloat
import com.swmansion.rnscreens.react.utils.readOptionalString
import com.swmansion.rnscreens.tabs.appearance.ItemStateAppearance
import com.swmansion.rnscreens.tabs.appearance.TabsAppearance
import com.swmansion.rnscreens.tabs.screen.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.tabs.screen.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.tabs.screen.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.tabs.screen.event.TabsScreenWillDisappearEvent

@ReactModule(name = TabsScreenViewManager.REACT_CLASS)
internal class TabsScreenViewManager :
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

    override fun onAfterUpdateTransaction(view: TabsScreen) {
        super.onAfterUpdateTransaction(view)
        view.resolveIconsIfNeeded()
    }

    override fun setScreenKey(
        view: TabsScreen,
        value: String?,
    ) {
        view.screenKey = value
    }

    override fun setBadgeValue(
        view: TabsScreen,
        value: String?,
    ) {
        view.badgeValue = value
    }

    override fun setTitle(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabTitle = value
    }

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

    override fun setPreventNativeSelection(
        view: TabsScreen,
        value: Boolean,
    ) {
        view.preventNativeSelection = value
    }

    override fun setTabBarItemTestID(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabBarItemTestID = value
    }

    override fun setTabBarItemAccessibilityLabel(
        view: TabsScreen,
        value: String?,
    ) {
        view.tabBarItemAccessibilityLabel = value
    }

    // Android specific

    override fun setDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.icon.drawableResourceName = value
    }

    override fun setSelectedDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.selectedIcon.drawableResourceName = value
    }

    override fun setIconTinting(
        view: TabsScreen,
        value: String?,
    ) {
        view.icon.tinting = TabsScreenIconTinting.fromString(value)
    }

    override fun setSelectedIconTinting(
        view: TabsScreen,
        value: String?,
    ) {
        view.selectedIcon.tinting = TabsScreenIconTinting.fromString(value)
    }

    override fun setImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        view.icon.imageUri = value?.getString("uri")
    }

    override fun setSelectedImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        view.selectedIcon.imageUri = value?.getString("uri")
    }

    override fun setStandardAppearance(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        if (value == null) {
            view.appearance = null
            return
        }

        view.appearance = parseAndroidTabsAppearance(view.context, value)
    }

    private fun parseAndroidTabsAppearance(
        context: Context,
        appearance: ReadableMap,
    ): TabsAppearance =
        TabsAppearance(
            tabBarBackgroundColor = appearance.readOptionalColor(context, "tabBarBackgroundColor"),
            tabBarItemRippleColor = appearance.readOptionalColor(context, "tabBarItemRippleColor"),
            tabBarItemLabelVisibilityMode = appearance.readOptionalString("tabBarItemLabelVisibilityMode"),
            normal = if (appearance.hasKey("normal")) parseItemStateAppearance(context, appearance.getMap("normal")) else null,
            selected = if (appearance.hasKey("selected")) parseItemStateAppearance(context, appearance.getMap("selected")) else null,
            focused = if (appearance.hasKey("focused")) parseItemStateAppearance(context, appearance.getMap("focused")) else null,
            disabled = if (appearance.hasKey("disabled")) parseItemStateAppearance(context, appearance.getMap("disabled")) else null,
            tabBarItemIconSize = appearance.readOptionalFloat("tabBarItemIconSize"),
            tabBarItemActiveIndicatorColor = appearance.readOptionalColor(context, "tabBarItemActiveIndicatorColor"),
            tabBarItemActiveIndicatorEnabled = appearance.readOptionalBoolean("tabBarItemActiveIndicatorEnabled"),
            tabBarItemActiveIndicatorWidth = appearance.readOptionalFloat("tabBarItemActiveIndicatorWidth"),
            tabBarItemActiveIndicatorHeight = appearance.readOptionalFloat("tabBarItemActiveIndicatorHeight"),
            tabBarItemTitleFontFamily = appearance.readOptionalString("tabBarItemTitleFontFamily"),
            tabBarItemTitleSmallLabelFontSize = appearance.readOptionalFloat("tabBarItemTitleSmallLabelFontSize"),
            tabBarItemTitleLargeLabelFontSize = appearance.readOptionalFloat("tabBarItemTitleLargeLabelFontSize"),
            tabBarItemTitleFontWeight = appearance.readOptionalString("tabBarItemTitleFontWeight")?.let(::parseFontWeight),
            tabBarItemTitleFontItalic = appearance.readOptionalString("tabBarItemTitleFontStyle")?.let { it == "italic" },
            tabBarItemBadgeBackgroundColor = appearance.readOptionalColor(context, "tabBarItemBadgeBackgroundColor"),
            tabBarItemBadgeTextColor = appearance.readOptionalColor(context, "tabBarItemBadgeTextColor"),
        )

    // Bold is 700 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
    // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
    // Anything else (e.g. "normal") falls back to the default weight.
    private fun parseFontWeight(fontWeight: String): Int? = if (fontWeight == "bold") 700 else fontWeight.toIntOrNull()

    private fun parseItemStateAppearance(
        context: Context,
        itemStateAppearance: ReadableMap?,
    ): ItemStateAppearance? {
        if (itemStateAppearance == null) return null
        return ItemStateAppearance(
            tabBarItemIconColor = itemStateAppearance.readOptionalColor(context, "tabBarItemIconColor"),
            tabBarItemTitleFontColor = itemStateAppearance.readOptionalColor(context, "tabBarItemTitleFontColor"),
        )
    }

    companion object {
        const val REACT_CLASS = "RNSTabsScreenAndroid"
    }
}
