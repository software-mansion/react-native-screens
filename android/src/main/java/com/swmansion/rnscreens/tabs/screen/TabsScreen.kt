package com.swmansion.rnscreens.tabs.screen

import android.content.res.Configuration
import android.graphics.drawable.Drawable
import android.os.Parcelable
import android.util.SparseArray
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.core.common.FragmentProviding
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.containers.common.Container
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.core.containers.common.ContainerItemSupport
import com.swmansion.rnscreens.core.utils.RNSLog
import com.swmansion.rnscreens.react.views.scrollviewmarker.ScrollViewMarker
import com.swmansion.rnscreens.react.views.scrollviewmarker.ScrollViewSeeking
import com.swmansion.rnscreens.tabs.appearance.TabsAppearance
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

/**
 * React Component view.
 */
internal class TabsScreen(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    FragmentProviding,
    ScrollViewSeeking,
    TabsContainerItem {
    private var tabsScreenDelegate: WeakReference<TabsScreenDelegate> = WeakReference(null)

    // region Handling configuration changes

    private var configObserver: TabsItemConfigurationObserver? = null

    override fun setConfigurationObserver(observer: TabsItemConfigurationObserver?) {
        configObserver = observer
    }

    private fun invalidate(flags: TabsItemInvalidationFlags) {
        configObserver?.onInvalidated(flags)
    }

    private fun <T> invalidatingProperty(
        initialValue: T,
        flags: TabsItemInvalidationFlags,
    ) = Delegates.observable(initialValue) { _, oldValue, newValue ->
        if (oldValue != newValue) invalidate(flags)
    }

    // endregion

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

    override var tabTitle: String? by invalidatingProperty(null, TabsItemInvalidationFlags.TITLE)

    // region Appearance

    override var appearance: TabsAppearance? by Delegates.observable(null) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            invalidate(resolveAppearanceInvalidationFlags(oldValue, newValue))
        }
    }

    // endregion

    // region Badge

    override var badgeValue: String? by invalidatingProperty(null, TabsItemInvalidationFlags.BADGE)

    // endregion

    // region Accessibility
    override var tabBarItemTestID: String? by invalidatingProperty(null, TabsItemInvalidationFlags.ACCESSIBILITY)

    override var tabBarItemAccessibilityLabel: String? by invalidatingProperty(null, TabsItemInvalidationFlags.ACCESSIBILITY)

    // endregion

    // region Icon

    internal val icon = TabsScreenIcon(reactContext, ::onIconChange)
    internal val selectedIcon = TabsScreenIcon(reactContext, ::onIconChange)

    override val iconDrawable: Drawable?
        get() = icon.drawable

    override val selectedIconDrawable: Drawable?
        get() = selectedIcon.drawable

    internal fun resolveIconsIfNeeded() {
        icon.resolveIfNeeded()
        selectedIcon.resolveIfNeeded()
    }

    private fun resolveAppearanceInvalidationFlags(
        oldValue: TabsAppearance?,
        newValue: TabsAppearance?,
    ): TabsItemInvalidationFlags {
        var flags = TabsItemInvalidationFlags.APPEARANCE
        if (oldValue?.tabBarItemIconSize != newValue?.tabBarItemIconSize) {
            flags = flags or TabsItemInvalidationFlags.ICON_SIZE
        }
        if (oldValue?.tabBarItemActiveIndicatorWidth != newValue?.tabBarItemActiveIndicatorWidth ||
            oldValue?.tabBarItemActiveIndicatorHeight != newValue?.tabBarItemActiveIndicatorHeight
        ) {
            flags = flags or TabsItemInvalidationFlags.ACTIVE_INDICATOR_SIZE
        }
        return flags
    }

    // endregion

    override var shouldUseRepeatedTabSelectionScrollToTopSpecialEffect: Boolean = true
    override var shouldUseRepeatedTabSelectionPopToRootSpecialEffect: Boolean = true

    override var preventNativeSelection: Boolean = false

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsScreen [$id] attached to window")
        super.onAttachedToWindow()
    }

    override fun shouldDelayChildPressedState(): Boolean = false

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    override fun dispatchSaveInstanceState(container: SparseArray<Parcelable>) {
        // Do nothing. React Native owns this view hierarchy and keeps it alive, so there is no
        // need to serialize/deserialize native view state. View ids in this subtree are react
        // tags, which are not stable identities - restoring state by id can apply state saved
        // by one view type to a different one, crashing e.g. in CompoundButton (see #4523).
    }

    override fun dispatchRestoreInstanceState(container: SparseArray<Parcelable>) {
        // Ignore restoring instance state too, as we are not saving anything anyways.
    }

    internal fun setTabsScreenDelegate(delegate: TabsScreenDelegate?) {
        tabsScreenDelegate = WeakReference(delegate)
    }

    override fun getAssociatedFragment(): Fragment? = tabsScreenDelegate.get()?.getFragmentForItem(this)

    private fun onIconChange() = invalidate(TabsItemInvalidationFlags.ICON)

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabsScreen must have its tag set when registering event emitters" }
        eventEmitter = TabsScreenEventEmitter(reactContext, id)
    }

    override val appearanceEventEmitter: ViewAppearanceEventEmitter
        get() = eventEmitter

    override fun onFragmentConfigurationChange(config: Configuration) {
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

    override val view: View
        get() = this

    override val itemKey: String?
        get() = screenKey

    override fun registerNestedContainer(container: Container) = containerItemSupport.registerNestedContainer(container)

    override fun unregisterNestedContainer(container: Container) = containerItemSupport.unregisterNestedContainer(container)

    override fun resolveNestedContainer(): Container? = containerItemSupport.resolveNestedContainer()

    override fun findContentScrollView(): ViewGroup? = containerItemSupport.findContentScrollView(this)

    // TabsScreen has no `preventNativeDismiss` flag of its own - it only forwards
    // the question to its nested container.
    override fun wantsToPreventStackNativeDismiss(): ContainerItem? = resolveNestedContainer()?.wantsToPreventStackNativeDismiss()

    // endregion

    companion object {
        const val TAG = "TabsScreen"
    }
}
