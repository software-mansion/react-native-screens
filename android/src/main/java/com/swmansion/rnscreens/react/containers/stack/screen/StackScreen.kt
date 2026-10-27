package com.swmansion.rnscreens.react.containers.stack.screen

import android.annotation.SuppressLint
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.core.common.FragmentProviding
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.containers.common.Container
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.core.containers.common.ContainerItemSupport
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.header.config.OnHeaderConfigurationAttachListener
import com.swmansion.rnscreens.core.containers.stack.screen.PreventNativeDismissChangeObserver
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.core.utils.findFragmentOrNull
import com.swmansion.rnscreens.react.common.ShadowStateProxy
import com.swmansion.rnscreens.react.containers.stack.header.config.StackHeaderConfig
import com.swmansion.rnscreens.react.containers.stack.host.StackHost
import com.swmansion.rnscreens.react.views.scrollviewmarker.ScrollViewMarker
import com.swmansion.rnscreens.react.views.scrollviewmarker.ScrollViewSeeking
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor") // should never be restored
internal class StackScreen(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    FragmentProviding,
    ScrollViewSeeking,
    StackContainerItem {
    enum class ActivityMode {
        DETACHED,
        ATTACHED,
    }

    private val containerItemSupport = ContainerItemSupport()

    override var isPreventNativeDismissEnabled: Boolean by Delegates.observable(false) { _, oldValue, newValue ->
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

    /**
     * Read whenever FragmentManager asks for a transition, so a change applies to the next
     * operation without notification.
     */
    override var animation: StackAnimationConfig = StackAnimationConfig.DEFAULT

    override var replaceAnimation: StackTransitionKind = StackTransitionKind.POP

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

    override fun onContentYOriginChanged(y: Int) {
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

    override fun registerHeaderConfigAttachListener(listener: OnHeaderConfigurationAttachListener) {
        check(onHeaderConfigurationAttachListener?.get() == null) {
            "[RNScreens] Attempted to register header config attach listener before previous listener was cleared."
        }
        onHeaderConfigurationAttachListener = WeakReference(listener)
        headerConfig?.let { listener.onHeaderConfigAttached(it, it) }
    }

    override fun clearHeaderConfigAttachListener() {
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
        headerConfig?.onContentScrollViewChanged()
    }

    // endregion

    internal lateinit var eventEmitter: StackScreenEventEmitter

    override var preventNativeDismissChangeObserver: PreventNativeDismissChangeObserver? = null

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] StackScreen must have its tag set when registering event emitters" }
        eventEmitter = StackScreenEventEmitter(reactContext, id)
    }

    override val appearanceEventEmitter: ViewAppearanceEventEmitter
        get() = eventEmitter

    override fun onDismiss() {
        if (activityMode == ActivityMode.ATTACHED) {
            isNativelyDismissed = true
        }
        eventEmitter.emitOnDismiss(isNativelyDismissed)
    }

    override fun onNativeDismissPrevented() {
        eventEmitter.emitOnNativeDismissPrevented()
    }

    override val view: View
        get() = this

    override val itemKey: String?
        get() = screenKey

    override fun getAssociatedFragment(): Fragment? =
        this.findFragmentOrNull()?.also {
            check(it is StackScreenFragment) { "[RNScreens] Unexpected fragment type: ${it.javaClass.simpleName}" }
        }

    override fun registerNestedContainer(container: Container) = containerItemSupport.registerNestedContainer(container)

    override fun unregisterNestedContainer(container: Container) = containerItemSupport.unregisterNestedContainer(container)

    override fun resolveNestedContainer(): Container? = containerItemSupport.resolveNestedContainer()

    override fun findContentScrollView(): ViewGroup? = containerItemSupport.findContentScrollView(this)

    override fun wantsToPreventStackNativeDismiss(): ContainerItem? =
        resolveNestedContainer()?.wantsToPreventStackNativeDismiss()
            ?: takeIf { isPreventNativeDismissEnabled }
}
