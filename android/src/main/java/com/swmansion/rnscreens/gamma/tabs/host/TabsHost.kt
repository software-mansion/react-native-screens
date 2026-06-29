package com.swmansion.rnscreens.gamma.tabs.host

import android.annotation.SuppressLint
import android.view.ViewTreeObserver
import android.widget.FrameLayout
import androidx.core.graphics.drawable.toDrawable
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.gamma.helpers.getFabricUIManagerNotNull
import com.swmansion.rnscreens.gamma.tabs.container.TabsActionOrigin
import com.swmansion.rnscreens.gamma.tabs.container.TabsContainer
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationState
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateObserver
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateRejectionReason
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateUpdateRequest
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.utils.RNSLog
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor") // Only created by us. Should never be restored
@OptIn(UnstableReactNativeAPI::class)
class TabsHost(
    val reactContext: ThemedReactContext,
) : FrameLayout(reactContext),
    TabsNavigationStateObserver,
    ViewTreeObserver.OnPreDrawListener,
    UIManagerListener {
    private val renderedScreens: ArrayList<TabsScreen> = arrayListOf()
    private var jsNavStateRequest: TabsNavigationStateUpdateRequest? = null
    private val layoutCoordinator: TabsHostLayoutCoordinator =
        TabsHostLayoutCoordinator(this, ::forceSubtreeMeasureAndLayoutPass)

    private var hasFirstLayoutWithInsets: Boolean = false

    private val container: TabsContainer =
        TabsContainer(reactContext).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT,
                )
        }

    internal var rejectStaleNavigationStateUpdates: Boolean by container::rejectStaleNavigationStateUpdates

    internal lateinit var eventEmitter: TabsHostEventEmitter

    var tabBarHidden: Boolean by container::tabBarHidden

    var nativeContainerBackgroundColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            container.background = newValue?.toDrawable()
        }
    }

    internal var colorScheme: ColorScheme by container::colorScheme
    var tabBarRespectsIMEInsets: Boolean by container::tabBarRespectsIMEInsets

    init {
        addView(container)
        check(container.addNavigationStateObserver(this)) {
            "[RNScreens] Failed to register TabsHost as navigation state observer"
        }
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .addUIManagerEventListener(this)
    }

    override fun onAttachedToWindow() {
        RNSLog.i(TAG, "TabsHost [$id] attached to window")
        viewTreeObserver.addOnPreDrawListener(this)
        super.onAttachedToWindow()
    }

    override fun onDetachedFromWindow() {
        viewTreeObserver.removeOnPreDrawListener(this)
        hasFirstLayoutWithInsets = false
        super.onDetachedFromWindow()
    }

    internal fun mountReactSubviewAt(
        tabsScreen: TabsScreen,
        index: Int,
    ) {
        val bottomNavigationViewMaxItemCount = container.bottomNavigationView.maxItemCount
        require(index < bottomNavigationViewMaxItemCount) {
            "[RNScreens] Attempt to insert TabsScreen at index $index; BottomNavigationView supports at most $bottomNavigationViewMaxItemCount items"
        }

        renderedScreens.add(index, tabsScreen)
        tabsScreen.setTabsScreenDelegate(container)

        container.addTabsScreenAt(index, tabsScreen)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        renderedScreens.removeAt(index).also { tabsScreen ->
            container.removeTabsScreenAt(index)
            tabsScreen.setTabsScreenDelegate(null)
        }
    }

    internal fun unmountReactSubview(reactSubview: TabsScreen) {
        if (renderedScreens.removeIf { it === reactSubview }) {
            assert(container.removeTabsScreen(reactSubview))
            reactSubview.setTabsScreenDelegate(null)
        }
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.forEach { it.setTabsScreenDelegate(null) }
        renderedScreens.clear()

        container.removeAllTabsScreens()
    }

    internal fun updateJSNavigationStateUpdateRequest(navStateRequest: TabsNavigationStateUpdateRequest) {
        jsNavStateRequest = navStateRequest
        container.setPendingNavigationStateUpdate(navStateRequest.copy())
    }

    /*
     * Forces a measure/layout pass across this subtree, ensuring the layout reaches native views embedded deep
     * within the React hierarchy (React views blocks layout because they have empty overrides for native layout logic).
     *
     * Scheduling is hybrid: `Handler.post` until the view tree is first laid out with insets applied (see
     * [onPreDraw]), then `ReactChoreographer` afterwards. This is required to avoid an inset jump on the initial
     * mount while preserving the Material BottomNavigationView tab-switch (ChangeBounds) animation. Rationale and
     * the full TransitionManager interaction are documented in the PR:
     * https://github.com/software-mansion/react-native-screens/pull/4161
     */
    private fun refreshLayout() {
        @Suppress("SENSELESS_COMPARISON") // layoutCoordinator can be null here since this method can be called in init
        if (layoutCoordinator != null) {
            if (!hasFirstLayoutWithInsets) {
                layoutCoordinator.postLayoutToMessageQueue()
            } else {
                layoutCoordinator.postLayoutToReactChoreographer()
            }
        }
    }

    /**
     * Marks that the view tree has been laid out with window insets already applied.
     *
     * `onPreDraw` is a reliable signal for this: within a single `ViewRootImpl.performTraversals()` insets are
     * dispatched and layout runs before `dispatchOnPreDraw()`, so by the time this fires the frame's insets have
     * been applied. See https://github.com/software-mansion/react-native-screens/pull/4161 for details.
     */
    override fun onPreDraw(): Boolean {
        hasFirstLayoutWithInsets = true
        return true
    }

    override fun requestLayout() {
        super.requestLayout()
        refreshLayout()
    }

    private fun forceSubtreeMeasureAndLayoutPass() {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
        )

        layout(left, top, right, bottom)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabsHost must have its tag set when registering event emitters" }
        eventEmitter = TabsHostEventEmitter(reactContext, id)
    }

    override fun onNavigationStateUpdate(
        navState: TabsNavigationState,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        actionOrigin: TabsActionOrigin,
    ) {
        eventEmitter.emitOnTabSelectedEvent(
            navState.selectedScreenKey,
            navState.provenance,
            isRepeated,
            hasTriggeredSpecialEffect,
            actionOrigin,
        )
    }

    override fun onNavigationStateUpdateRejected(
        currentNavState: TabsNavigationState,
        rejectedRequest: TabsNavigationStateUpdateRequest,
        reason: TabsNavigationStateRejectionReason,
    ) {
        eventEmitter.emitOnTabSelectionRejectedEvent(
            currentNavState,
            rejectedRequest,
            reason,
        )
    }

    override fun onNavigationStateUpdatePrevented(
        currentNavState: TabsNavigationState,
        preventedScreenKey: String,
    ) {
        eventEmitter.emitOnTabSelectionPreventedEvent(currentNavState, preventedScreenKey)
    }

    override fun didMountItems(uiManager: UIManager) {
        container.flushPendingUpdates()
    }

    /**
     * Called by [TabsHostViewManager.onDropViewInstance] when this view is recycled.
     * Idempotent: safe to call multiple times.
     */
    internal fun tearDown() {
        container.removeNavigationStateObserver(this)
        container.tearDown()
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .removeUIManagerEventListener(this)
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun willMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    companion object {
        const val TAG = "TabsHost"
    }
}
