package com.swmansion.rnscreens.gamma.tabs.screen

import android.content.res.Configuration
import android.graphics.drawable.Drawable
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.gamma.helpers.NoTintDrawable
import com.swmansion.rnscreens.gamma.helpers.getSystemDrawableResource
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
    FragmentProviding {
    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    private var tabsScreenDelegate: WeakReference<TabsScreenDelegate> = WeakReference(null)

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

    // Appearance

    internal var appearance: TabsAppearance? by Delegates.observable(null) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            tabsScreenDelegate.get()?.onAppearanceChanged(this)
        }
    }

    // Badge
    var badgeValue: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // Accessibility
    var tabBarItemTestID: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var tabBarItemAccessibilityLabel: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // Icon
    var drawableIconResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) rebuildIcon()
    }

    var drawableIconTintingMode: String = "template"
        set(value) {
            if (field != value) {
                field = value
                rebuildIcon()
            }
        }

    var selectedDrawableIconResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) rebuildSelectedIcon()
    }

    var selectedDrawableIconTintingMode: String = "template"
        set(value) {
            if (field != value) {
                field = value
                rebuildSelectedIcon()
            }
        }

    // Per-tab icon size in dp; 0 means the default.
    var drawableIconSize: Float = 0f

    val effectiveIconSizeDp: Float
        get() = if (drawableIconSize > 0f) drawableIconSize else DEFAULT_ICON_SIZE_DP

    var activeIndicatorWidth: Float = 0f
    var activeIndicatorHeight: Float = 0f

    // "original" keeps the drawable's own colors; the bar can't tint a NoTintDrawable.
    private fun resolveIcon(
        resourceName: String?,
        tintingMode: String,
    ): Drawable? {
        val drawable = getSystemDrawableResource(reactContext, resourceName) ?: return null
        return if (tintingMode == "original") NoTintDrawable(drawable) else drawable
    }

    private fun rebuildIcon() {
        icon = resolveIcon(drawableIconResourceName, drawableIconTintingMode)
    }

    private fun rebuildSelectedIcon() {
        selectedIcon = resolveIcon(selectedDrawableIconResourceName, selectedDrawableIconTintingMode)
    }

    var icon: Drawable? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var selectedIcon: Drawable? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

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

    companion object {
        const val TAG = "TabsScreen"

        // Material's default bottom-navigation icon size (dp).
        internal const val DEFAULT_ICON_SIZE_DP = 24f
    }
}
