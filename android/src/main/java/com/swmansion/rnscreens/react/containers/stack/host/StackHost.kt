package com.swmansion.rnscreens.react.containers.stack.host

import android.annotation.SuppressLint
import android.view.ViewGroup
import androidx.fragment.app.FragmentManager
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.core.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.core.containers.stack.host.StackActionOrigin
import com.swmansion.rnscreens.core.containers.stack.host.StackContainer
import com.swmansion.rnscreens.core.containers.stack.host.StackContainerDelegate
import com.swmansion.rnscreens.core.containers.stack.host.StackContainerParent
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationState
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateObserver
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRequest
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem
import com.swmansion.rnscreens.core.utils.RNSLog
import com.swmansion.rnscreens.react.containers.stack.screen.StackScreen
import com.swmansion.rnscreens.react.utils.FragmentManagerHelper
import com.swmansion.rnscreens.react.utils.ViewIdGenerator
import com.swmansion.rnscreens.react.utils.getFabricUIManagerNotNull
import com.swmansion.rnscreens.react.utils.verifyReactTagSchemeInDebug
import java.lang.ref.WeakReference

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor") // should never be restored
internal class StackHost(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    UIManagerListener,
    StackContainerDelegate,
    StackContainerParent,
    StackNavigationStateObserver {
    internal val renderedScreens: ArrayList<StackScreen> = arrayListOf()
    private val container = StackContainer(reactContext, WeakReference(this), ViewIdGenerator)
    private var isLayoutEnqueued = false

    internal var colorScheme: ColorScheme by container::colorScheme

    internal var rejectStaleNavigationStateUpdates: Boolean by container::rejectStaleNavigationStateUpdates

    internal lateinit var eventEmitter: StackHostEventEmitter

    init {
        addView(container)
        check(container.addNavigationStateObserver(this)) {
            "[RNScreens] Failed to register StackHost as navigation state observer"
        }

        // We're adding ourselves during a batch, therefore we expect to receive its finalization callbacks
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .addUIManagerEventListener(this)
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackHost [$id] attached to window")
        super.onAttachedToWindow()
        verifyReactTagSchemeInDebug(this)
    }

    internal fun mountReactSubviewAt(
        stackScreen: StackScreen,
        index: Int,
    ) {
        renderedScreens.add(index, stackScreen)
        stackScreen.stackHost = WeakReference(this)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        renderedScreens.removeAt(index)
    }

    internal fun unmountReactSubview(reactSubview: StackScreen) {
        renderedScreens.remove(reactSubview)
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.clear()
    }

    internal fun updateJSNavigationStateRequest(request: StackNavigationStateRequest) {
        container.setPendingNavigationStateRequest(request)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from the view manager, the view tag is already set.
        check(id != NO_ID) { "[RNScreens] StackHost must have its tag set when registering event emitters" }
        eventEmitter = StackHostEventEmitter(reactContext, id)
    }

    // region StackNavigationStateObserver

    override fun onNavigationStateUpdate(
        navState: StackNavigationState,
        actionOrigin: StackActionOrigin,
    ) {
        eventEmitter.emitOnNavStateChanged(navState, actionOrigin)
    }

    override fun onNavigationStateUpdateRejected(
        currentNavState: StackNavigationState,
        rejectedRequest: StackNavigationStateRequest,
        reason: StackNavigationStateRejectionReason,
    ) {
        eventEmitter.emitOnNavStateRequestRejected(currentNavState, rejectedRequest, reason)
    }

    override fun onScreensReleased(screenKeys: List<String>) {
        eventEmitter.emitOnScreensReleased(screenKeys)
    }

    override fun onNativeDismissPrevented(
        currentNavState: StackNavigationState,
        preventedScreenKeys: List<String>,
    ) {
        eventEmitter.emitOnNativeDismissPrevented(currentNavState, preventedScreenKeys)
    }

    // endregion

    override fun onItemDismissCommitted(item: StackContainerItem) {
        check(item is StackScreen) {
            "[RNScreens] Unexpected stack item type: ${item.javaClass.simpleName}"
        }
    }

    override fun resolveFragmentManager(): FragmentManager =
        checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
            "[RNScreens] Nullish fragment manager - can't run container operations"
        }

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        container.measure(widthMeasureSpec, heightMeasureSpec)
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        container.layout(l, t, r, b)
    }

    // ReactViewGroup overrides requestLayout to a no-op therefore the request might not be
    // propagated to the root view. That's why we need to manually force measure and layout pass.
    override fun requestLayout() {
        super.requestLayout()
        refreshLayout()
    }

    // On window configuration changes ViewRootImpl calls forceLayout() recursively on every view
    // in the hierarchy, bypassing requestLayout(). React views never lay out their children during
    // framework traversals, so nothing would clear the force-layout flags in our subtree — and once
    // they are set, any subsequent requestLayout() from a descendant short-circuits before reaching
    // the override above, permanently disabling the manual pass. Schedule it from here as well.
    override fun forceLayout() {
        super.forceLayout()
        refreshLayout()
    }

    private fun refreshLayout() {
        if (!isLayoutEnqueued) {
            isLayoutEnqueued = true
            post {
                isLayoutEnqueued = false
                forceSubtreeMeasureAndLayoutPass()
            }
        }
    }

    private fun forceSubtreeMeasureAndLayoutPass() {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
        )

        layout(left, top, right, bottom)
    }

    override fun layoutContainerNow() {
        if (measuredWidth != container.measuredWidth || measuredHeight != container.measuredHeight) {
            container.measure(
                MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY),
            )
        }
        container.layout(left, top, right, bottom)
    }

    override fun willMountItems(uiManager: UIManager) {
        container.beginUpdateBatch()
    }

    override fun didMountItems(uiManager: UIManager) {
        container.endUpdateBatch()
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    internal fun tearDown() {
        // A host that goes away emits no events.
        container.removeNavigationStateObserver(this)
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .removeUIManagerEventListener(this)
    }

    companion object {
        const val TAG = "StackHost"
    }
}
