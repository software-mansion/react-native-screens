package com.swmansion.rnscreens.gamma.tabs.screen

import android.content.res.Configuration
import android.graphics.drawable.Drawable
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.gamma.common.container.Container
import com.swmansion.rnscreens.gamma.common.container.ContainerItem
import com.swmansion.rnscreens.gamma.common.container.ContainerItemSupport
import com.swmansion.rnscreens.gamma.helpers.getSystemDrawableResource
import com.swmansion.rnscreens.gamma.scrollviewmarker.ScrollViewMarker
import com.swmansion.rnscreens.gamma.scrollviewmarker.ScrollViewSeeking
import com.swmansion.rnscreens.gamma.tabs.appearance.TabsAppearance
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

/**
 * React Component view.
 */
class TabsScreen(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    FragmentProviding,
    ScrollViewSeeking,
    ContainerItem {
    private var tabsScreenDelegate: WeakReference<TabsScreenDelegate> = WeakReference(null)
    private val containerItemSupport = ContainerItemSupport()

    internal lateinit var eventEmitter: TabsScreenEventEmitter

    var screenKey: String? = null
        set(value) {
            field =
                if (value?.isBlank() == true) {
                    null
                } else {
                    value
                }
        }

    internal val requireScreenKey: String
        get() = checkNotNull(screenKey) { "[RNScreens] screenKey MUST NOT be null" }

    var tabTitle: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // region Appearance

    internal var appearance: TabsAppearance? by Delegates.observable(null) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            tabsScreenDelegate.get()?.onAppearanceChanged(this)
        }
    }

    // endregion

    // region Badge

    var badgeValue: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // endregion

    // region Accessibility
    var tabBarItemTestID: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var tabBarItemAccessibilityLabel: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // endregion

    // region Icon
    var drawableIconResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            icon = getSystemDrawableResource(reactContext, newValue)
        }
    }

    var selectedDrawableIconResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            selectedIcon = getSystemDrawableResource(reactContext, newValue)
        }
    }

    var icon: Drawable? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var selectedIcon: Drawable? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // endregion

    var shouldUseRepeatedTabSelectionScrollToTopSpecialEffect: Boolean = true
    var shouldUseRepeatedTabSelectionPopToRootSpecialEffect: Boolean = true

    var preventNativeSelection: Boolean = false

    private fun <T> updateMenuItemAttributesIfNeeded(
        oldValue: T,
        newValue: T,
    ) {
        if (newValue != oldValue) {
            onMenuItemAttributesChange()
        }
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsScreen [$id] attached to window")
        super.onAttachedToWindow()
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    internal fun setTabsScreenDelegate(delegate: TabsScreenDelegate?) {
        tabsScreenDelegate = WeakReference(delegate)
    }

    override fun getAssociatedFragment(): Fragment? = tabsScreenDelegate.get()?.getFragmentForTabsScreen(this)

    private fun onMenuItemAttributesChange() {
        tabsScreenDelegate.get()?.onMenuItemAttributesChange(this)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabsScreen must have its tag set when registering event emitters" }
        eventEmitter = TabsScreenEventEmitter(reactContext, id)
    }

    /**
     * Notify the view that it's associated fragment got its config updated.
     *
     * There are cases where the fragment will receive configuration change, but it's view will not,
     * e.g. theme update from JS via Appearance.setColorScheme.
     */
    internal fun onFragmentConfigurationChange(
        fragment: TabsScreenFragment,
        config: Configuration,
    ) {
        tabsScreenDelegate.get()?.onFragmentConfigurationChange(this, config)
    }

    // region ScrollViewSeeking
    override fun registerScrollView(
        marker: ScrollViewMarker,
        scrollView: ViewGroup,
    ) {
        containerItemSupport.registerScrollView(scrollView)
    }

    // endregion

    // region ContainerItem

    override fun registerNestedContainer(container: Container) = containerItemSupport.registerNestedContainer(container)

    override fun unregisterNestedContainer(container: Container) = containerItemSupport.unregisterNestedContainer(container)

    override fun resolveNestedContainer(): Container? = containerItemSupport.resolveNestedContainer()

    override fun findContentScrollView(): ViewGroup? = containerItemSupport.findContentScrollView(this)

    // endregion

    companion object {
        const val TAG = "TabsScreen"
    }
}
