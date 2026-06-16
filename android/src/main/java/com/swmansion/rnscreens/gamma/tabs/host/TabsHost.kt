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
    private val layoutCoordinator: TabsHostLayoutCoordinator = TabsHostLayoutCoordinator(this)

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

    /**
     * Forces a measure/layout pass over our subtree after a React-driven update. Chooses between two
     * scheduling methods depending on whether the insets were already propagated.
     *
     *  - [TabsHostLayoutCoordinator.postLayout] - `Handler.post`, runs on the NEXT frame. Used until the insets
     *    are propagated. See [onPreDraw].
     *  - [TabsHostLayoutCoordinator.choreographerLayout] — `ReactChoreographer` `NATIVE_ANIMATED_MODULE`
     *    queue, runs in the CURRENT frame. Used afterwards. It catches the current frame instead
     *    of enqueueing on the next one, avoiding a delay.
     *
     * The FIRST layout must be deferred, due to the interaction with the Material BottomNavigationView's
     * delayed transition:
     *
     * 1. Changing a tab calls `NavigationBarMenuView.updateMenuView()`
     * 2. When the selection changed, `TransitionManager` runs `beginDelayedTransition(this, set)`. `set` is an
     *    `AutoTransition` (Fade + ChangeBounds + TextScale).
     * 3. `beginDelayedTransition` immediately captures `startValues` for the BottomNavigationView subtree
     *     BEFORE performing out the layout of its items.
     * 4. In the next step, it installs a TransitionManager `OnPreDrawListener` that, during the
     *    upcoming `ViewTreeObserver.dispatchOnPreDraw()`, captures `endValues` and builds the animators in
     *    `playTransition()`. Animators are created dependent on the diff between `startValues` and `endValues`:
     *
     *  - in [TabsHostLayoutCoordinator.postLayout] (`Handler.post`) path our [forceSubtreeMeasureAndLayoutPass] is queued for the NEXT
     *    frame, so it does NOT run between the `startValues` snapshot and the transition's `endValues`
     *    capture. From the transition's point of view the subtree layout is unchanged; only
     *    `android:fade:transitionAlpha` (and `navigation_bar_item_labels_group` visibility 8 -> 0) differ.
     *    Result: a clean fade animator is created, NO bounds animation is performed.
     *
     *  - in [TabsHostLayoutCoordinator.choreographerLayout] (`ReactChoreographer`) path our forced layout runs in the SAME frame,
     *    BEFORE `dispatchOnPreDraw`, so the subtree is already laid out when the transition captures
     *    `endValues`. Now `android:changeBounds` also differs (e.g. `navigation_bar_item_content_container`
     *    and `navigation_bar_item_labels_group` bounds move), so ChangeBounds animators are created and the
     *    BottomNavigationView's content tries to animate during enter transition.
     *
     * Once insets are applied, we switch back to the responsive in-frame scheduling for subsequent updates to
     * allow the ChangeBounds animation to run on the subsequent tab selection changes.
     */
    private fun refreshLayout() {
        @Suppress("SENSELESS_COMPARISON") // layoutCoordinator can be null here since this method can be called in init
        if (layoutCoordinator != null) {
            if (!hasFirstLayoutWithInsets) {
                layoutCoordinator.postLayout()
            } else {
                layoutCoordinator.choreographerLayout()
            }
        }
    }

    /**
     * Marks that the view tree has been laid out with window insets already applied.
     *
     * `onPreDraw` is a reliable signal that insets have already been propagated for this frame:
     * `ViewRootImpl.performTraversals()` runs in the Choreographer `CALLBACK_TRAVERSAL` phase, and within a
     * single traversal it
     * 1. computes and dispatches window insets down the hierarchy (`dispatchApplyWindowInsets`),
     * 2. runs measure + layout,
     * 3. invokes `ViewTreeObserver.dispatchOnPreDraw()` - immediately before `performDraw()`. So by the time this
     * callback fires, the insets for the frame have been applied.
     */
    override fun onPreDraw(): Boolean {
        hasFirstLayoutWithInsets = true
        return true
    }

    override fun requestLayout() {
        super.requestLayout()
        refreshLayout()
    }

    internal fun forceSubtreeMeasureAndLayoutPass() {
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
