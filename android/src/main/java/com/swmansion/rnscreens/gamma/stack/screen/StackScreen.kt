package com.swmansion.rnscreens.gamma.stack.screen

import android.annotation.SuppressLint
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.ext.findFragmentOrNull
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfiguration
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationAttachObserver
import com.swmansion.rnscreens.gamma.stack.host.StackHost
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor") // should never be restored
class StackScreen(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    FragmentProviding {
    enum class ActivityMode {
        DETACHED,
        ATTACHED,
    }

    internal var isPreventNativeDismissEnabled: Boolean by Delegates.observable(false) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            preventNativeDismissChangeObserver?.preventNativeDismissChanged(newValue)
        }
    }

    internal var isNativelyDismissed = false
        set(value) {
            require(value) {
                "[RNScreens] Natively dismissed StackScreen must remain dismissed."
            }
            field = true
        }
    internal var stackHost: WeakReference<StackHost?> = WeakReference(null)

    var activityMode: ActivityMode by Delegates.observable(ActivityMode.DETACHED) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            stackHost.get()?.stackScreenChangedActivityMode(this)
        }
    }

    var screenKey: String? = null
        set(value) {
            require(
                field == null,
            ) { "[RNScreens] StackScreen can't change its screenKey." }
            field = value
        }

    private val shadowStateProxy = StackScreenShadowStateProxy()

    var stateWrapper by shadowStateProxy::stateWrapper

    fun updateStateIfNeeded(
        x: Int? = null,
        y: Int? = null,
        width: Int? = null,
        height: Int? = null,
    ) = shadowStateProxy.updateStateIfNeeded(x, y, width, height)

    // --- Header configuration ---
    // StackScreen is a dumb pass-through. It stores the header and notifies an observer.
    // The observer is set by whoever manages the header (e.g., StackHeaderCoordinatorLayout).
    // WeakReference avoids a cycle: CoordinatorLayout → StackScreen → observer → CoordinatorLayout.

    internal var headerConfiguration: StackHeaderConfiguration? = null
        private set

    internal var headerConfigurationAttachObserver: WeakReference<StackHeaderConfigurationAttachObserver>? = null

    internal fun attachHeaderConfiguration(header: StackHeaderConfiguration) {
        headerConfiguration = header
        headerConfigurationAttachObserver?.get()?.onHeaderConfigurationChanged(header)
    }

    internal fun detachHeaderConfiguration(header: StackHeaderConfiguration) {
        if (headerConfiguration === header) {
            headerConfiguration = null
            headerConfigurationAttachObserver?.get()?.onHeaderConfigurationChanged(null)
        }
    }

    internal lateinit var eventEmitter: StackScreenEventEmitter

    /**
     * Use this to set/unset the observer.
     */
    internal var preventNativeDismissChangeObserver: PreventNativeDismissChangeObserver? = null

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] StackScreen must have its tag set when registering event emitters" }
        eventEmitter = StackScreenEventEmitter(reactContext, id)
    }

    internal fun createAppearanceEventsEmitter(viewLifecycleOwner: LifecycleOwner) =
        StackScreenAppearanceEventsEmitter(viewLifecycleOwner.lifecycle, eventEmitter)

    internal fun onDismiss() {
        if (activityMode == ActivityMode.ATTACHED) {
            isNativelyDismissed = true
        }
        eventEmitter.emitOnDismiss(isNativelyDismissed)
    }

    internal fun onNativeDismissPrevented() {
        eventEmitter.emitOnNativeDismissPrevented()
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        shadowStateProxy.updateStateIfNeeded(width = r - l, height = b - t)
    }

    override fun getAssociatedFragment(): Fragment? =
        this.findFragmentOrNull()?.also {
            check(it is StackScreenFragment) { "[RNScreens] Unexpected fragment type: ${it.javaClass.simpleName}" }
        }
}
