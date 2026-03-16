package com.swmansion.rnscreens.gamma.tabs.host

import android.view.View
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsHostAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSTabsHostAndroidManagerInterface
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostNativeFocusChangeEvent
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen

@ReactModule(name = TabsHostViewManager.REACT_CLASS)
class TabsHostViewManager :
    ViewGroupManager<TabsHost>(),
    RNSTabsHostAndroidManagerInterface<TabsHost> {
    private val delegate: ViewManagerDelegate<TabsHost> = RNSTabsHostAndroidManagerDelegate<TabsHost, TabsHostViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = TabsHost(reactContext)

    protected override fun getDelegate(): ViewManagerDelegate<TabsHost> = delegate

    override fun addView(
        parent: TabsHost,
        child: View,
        index: Int,
    ) {
        require(child is TabsScreen) { "[RNScreens] Attempt to attach child that is not of type ${TabsScreen::javaClass.name}" }
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(
        parent: TabsHost,
        child: View,
    ) {
        require(child is TabsScreen) { "[RNScreens] Attempt to detach child that is not of type ${TabsScreen::javaClass.name}" }
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

//    override fun setNavState(view: TabsHost, value: ReadableMap?) {
//        val navStateMap = requireNotNull(value) { "[RNScreens] NavState must not be nullish" }
//        val selectedScreenKey = requireNotNull(navStateMap.getString("selectedScreenKey"))
//        val provenance = requireNotNull(navStateMap.getInt("provenance"))
// //        view.setNavStateFromJS(TabsHost.NavState(selectedScreenKey, provenance))
//    }
//
    override fun setTabBarHidden(
        view: TabsHost,
        value: Boolean,
    ) {
        view.tabBarHidden = value
    }

    override fun setNativeContainerBackgroundColor(
        view: TabsHost,
        value: Int?,
    ) {
        view.nativeContainerBackgroundColor = value
    }

    override fun setTabBarRespectsIMEInsets(
        view: TabsHost,
        value: Boolean,
    ) {
        view.tabBarRespectsIMEInsets = value
    }

    override fun setColorScheme(
        view: TabsHost,
        value: String?,
    ) {
        when (value) {
            "inherit" -> view.colorScheme = ColorScheme.INHERIT
            "light" -> view.colorScheme = ColorScheme.LIGHT
            "dark" -> view.colorScheme = ColorScheme.DARK
            else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid color scheme: $value.")
        }
    }

    companion object {
        const val REACT_CLASS = "RNSTabsHostAndroid"
    }
}
