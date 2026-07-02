package com.swmansion.rnscreens.gamma.stack.screen

import android.annotation.SuppressLint
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.ext.findFragmentOrNull
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.common.container.Container
import com.swmansion.rnscreens.gamma.common.container.ContainerItem
import com.swmansion.rnscreens.gamma.common.container.ContainerItemSupport
import com.swmansion.rnscreens.gamma.scrollviewmarker.ScrollViewMarker
import com.swmansion.rnscreens.gamma.scrollviewmarker.ScrollViewSeeking
import com.swmansion.rnscreens.gamma.stack.header.config.OnHeaderConfigurationAttachListener
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfig
import com.swmansion.rnscreens.gamma.stack.host.StackHost
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor") // should never be restored
class StackScreen(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    FragmentProviding,
    ScrollViewSeeking,
    ContainerItem {
    enum class ActivityMode {
        DETACHED,
        ATTACHED,
    }

    private val containerItemSupport = ContainerItemSupport()

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

    // region Shadow State synchronization

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

    internal fun onContentYOriginChanged(y: Int) {
        shadowStateProxy.updateStateIfNeeded(
            density = resources.displayMetrics.density,
            contentOffsetY = y,
        )
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        shadowStateProxy.updateStateIfNeeded(
            density = resources.displayMetrics.density,
            frameWidth = r - l,
            frameHeight = b - t,
        )
    }

    // endregion

    // region Header config

    internal var headerConfig: StackHeaderConfig? = null
        private set

    private var onHeaderConfigurationAttachListener: WeakReference<OnHeaderConfigurationAttachListener>? = null

    internal fun registerHeaderConfigAttachListener(listener: OnHeaderConfigurationAttachListener) {
        check(onHeaderConfigurationAttachListener?.get() == null) {
            "[RNScreens] Attempted to register header config attach listener before previous listener was cleared."
        }
        onHeaderConfigurationAttachListener = WeakReference(listener)
        headerConfig?.let { listener.onHeaderConfigAttached(it, it) }
    }

    internal fun clearHeaderConfigAttachListener() {
        onHeaderConfigurationAttachListener = null
    }

    internal fun attachHeaderConfig(header: StackHeaderConfig) {
        headerConfig = header
        onHeaderConfigurationAttachListener?.get()?.onHeaderConfigAttached(header, header)
    }

    internal fun detachHeaderConfig(header: StackHeaderConfig) {
        if (headerConfig === header) {
            headerConfig = null
            onHeaderConfigurationAttachListener?.get()?.onHeaderConfigAttached(null, null)
        }
    }

    // endregion

    // region ScrollViewSeeking

    override fun registerScrollView(
        marker: ScrollViewMarker,
        scrollView: ViewGroup,
    ) {
        containerItemSupport.registerScrollView(scrollView)
    }

    // endregion

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

    override fun getAssociatedFragment(): Fragment? =
        this.findFragmentOrNull()?.also {
            check(it is StackScreenFragment) { "[RNScreens] Unexpected fragment type: ${it.javaClass.simpleName}" }
        }

    override fun registerNestedContainer(container: Container) = containerItemSupport.registerNestedContainer(container)

    override fun unregisterNestedContainer(container: Container) = containerItemSupport.unregisterNestedContainer(container)

    override fun resolveNestedContainer(): Container? = containerItemSupport.resolveNestedContainer()

    override fun findContentScrollView(): ViewGroup? = containerItemSupport.findContentScrollView(this)
}
