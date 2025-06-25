package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

/**
 * React Component view.
 */
class TabScreen(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext) {
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

    var tabTitle: String? by Delegates.observable(null) { property, oldValue, newValue ->
        if (newValue != oldValue) {
            onTabTitleChangedFromJS()
        }
    }

    override fun onAttachedToWindow() {
        Log.d(TAG, "TabScreen [$id] attached to window")
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

    private fun onTabFocusChangedFromJS() {
        tabScreenDelegate.get()?.onTabFocusChangedFromJS(this, isFocusedTab)
    }

    private fun onTabTitleChangedFromJS() {
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
