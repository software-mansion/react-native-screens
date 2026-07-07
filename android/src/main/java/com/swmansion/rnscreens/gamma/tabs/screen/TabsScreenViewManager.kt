package com.swmansion.rnscreens.gamma.tabs.screen

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsScreenAndroidManagerInterface
import com.swmansion.rnscreens.gamma.helpers.loadImage
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.helpers.readOptionalBoolean
import com.swmansion.rnscreens.gamma.helpers.readOptionalColor
import com.swmansion.rnscreens.gamma.helpers.readOptionalFloat
import com.swmansion.rnscreens.gamma.helpers.readOptionalString
import com.swmansion.rnscreens.gamma.tabs.appearance.ItemStateAppearance
import com.swmansion.rnscreens.gamma.tabs.appearance.TabsAppearance
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
        view.drawableIconResourceName = value
    }

    override fun setSelectedDrawableIconResourceName(
        view: TabsScreen,
        value: String?,
    ) {
        view.selectedDrawableIconResourceName = value
    }

    override fun setImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            loadImage(view.context, uri) { drawable ->
                view.icon = drawable
            }
        }
    }

    override fun setSelectedImageIconResource(
        view: TabsScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")
        if (uri != null) {
            loadImage(view.context, uri) { drawable ->
                view.selectedIcon = drawable
            }
        }
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
            tabBarItemActiveIndicatorColor = appearance.readOptionalColor(context, "tabBarItemActiveIndicatorColor"),
            tabBarItemActiveIndicatorEnabled = appearance.readOptionalBoolean("tabBarItemActiveIndicatorEnabled"),
            tabBarItemTitleFontFamily = appearance.readOptionalString("tabBarItemTitleFontFamily"),
            tabBarItemTitleSmallLabelFontSize = appearance.readOptionalFloat("tabBarItemTitleSmallLabelFontSize"),
            tabBarItemTitleLargeLabelFontSize = appearance.readOptionalFloat("tabBarItemTitleLargeLabelFontSize"),
            tabBarItemTitleFontWeight = appearance.readOptionalString("tabBarItemTitleFontWeight"),
            tabBarItemTitleFontStyle = appearance.readOptionalString("tabBarItemTitleFontStyle"),
            tabBarItemBadgeBackgroundColor = appearance.readOptionalColor(context, "tabBarItemBadgeBackgroundColor"),
            tabBarItemBadgeTextColor = appearance.readOptionalColor(context, "tabBarItemBadgeTextColor"),
        )

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
