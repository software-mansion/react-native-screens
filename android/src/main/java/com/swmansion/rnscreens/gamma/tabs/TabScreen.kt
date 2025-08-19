package com.swmansion.rnscreens.gamma.tabs

import android.graphics.drawable.Drawable
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.gamma.helpers.getSystemDrawableResource
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

/**
 * React Component view.
 */
class TabScreen(
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

    private var tabScreenDelegate: WeakReference<TabScreenDelegate> = WeakReference(null)

    internal lateinit var eventEmitter: TabScreenEventEmitter

    var tabKey: String? = null
        set(value) {
            field =
                if (value?.isBlank() == true) {
                    null
                } else {
                    value
                }
        }

    var tabTitle: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // Badge
    var badgeValue: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var tabBarItemBadgeTextColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    var tabBarItemBadgeBackgroundColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    // Icon
    var iconResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            icon = getSystemDrawableResource(reactContext, newValue)
        }
    }

    var icon: Drawable? by Delegates.observable(null) { _, oldValue, newValue ->
        updateMenuItemAttributesIfNeeded(oldValue, newValue)
    }

    private fun <T> updateMenuItemAttributesIfNeeded(
        oldValue: T,
        newValue: T,
    ) {
        if (newValue != oldValue) {
            onMenuItemAttributesChange()
        }
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabScreen [$id] attached to window")
        super.onAttachedToWindow()
    }

    var isFocusedTab: Boolean = false
        set(value) {
            if (field != value) {
                field = value
                onTabFocusChangedFromJS()
            }
        }

    internal fun setTabScreenDelegate(delegate: TabScreenDelegate?) {
        tabScreenDelegate = WeakReference(delegate)
    }

    override fun getAssociatedFragment(): Fragment? = tabScreenDelegate.get()?.getFragmentForTabScreen(this)

    private fun onTabFocusChangedFromJS() {
        tabScreenDelegate.get()?.onTabFocusChangedFromJS(this, isFocusedTab)
    }

    private fun onMenuItemAttributesChange() {
        tabScreenDelegate.get()?.onMenuItemAttributesChange(this)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabScreen must have its tag set when registering event emitters" }
        eventEmitter = TabScreenEventEmitter(reactContext, id)
    }

    companion object {
        const val TAG = "TabScreen"
    }
}
