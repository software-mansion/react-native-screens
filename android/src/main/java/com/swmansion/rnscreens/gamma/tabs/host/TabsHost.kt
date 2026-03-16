package com.swmansion.rnscreens.gamma.tabs.host

import android.view.Choreographer
import android.widget.FrameLayout
import androidx.core.graphics.drawable.toDrawable
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.gamma.tabs.container.TabsContainer
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment
import com.swmansion.rnscreens.utils.RNSLog
import kotlin.properties.Delegates

class TabsHost(
    val reactContext: ThemedReactContext,
) : FrameLayout(reactContext) {
    /**
     * All container updates should go through instance of this class.
     * The semantics are as follows:
     *
     * * `invalidateXXX` methods do mark that some update is required, however **they do not schedule the update**!
     * * `postXXX` methods schedule an update
     * * `runXXX` methods execute update synchronously
     *
     * If there is a posted update & before it is executed updates are flushed synchronously, then
     * the posted update becomes a noop.
     */
    private inner class ContainerUpdateCoordinator {
        private var isUpdatePending: Boolean = false

        private val container: TabsContainer
            get() = this@TabsHost.container

        fun invalidateSelectedTab() {
            container.invalidationFlags.isSelectedTabInvalidated = true
        }

        fun invalidateNavigationMenu() {
            container.invalidationFlags.isBottomNavigationMenuInvalidated = true
        }

        fun invalidateAll() {
            invalidateSelectedTab()
            invalidateNavigationMenu()
        }

        fun postContainerUpdateIfNeeded() {
            if (isUpdatePending) {
                return
            }
            postContainerUpdate()
        }

        fun postContainerUpdate() {
            isUpdatePending = true
            post {
                runContainerUpdateIfNeeded()
            }
        }

        private fun runContainerUpdateIfNeeded() {
            if (isUpdatePending) {
                runContainerUpdate()
            }
        }

        fun runContainerUpdate() {
            isUpdatePending = false
            this@TabsHost.container.performContainerUpdateIfNeeded()
        }
    }

    private val renderedScreens: ArrayList<TabsScreen> = arrayListOf()

    private val containerUpdateCoordinator = ContainerUpdateCoordinator()

    private val container: TabsContainer = TabsContainer(reactContext, this).apply {
        layoutParams =
            LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT,
            )
    }

    internal lateinit var eventEmitter: TabsHostEventEmitter

    private var isLayoutEnqueued: Boolean = false

    var tabBarHidden: Boolean by container::tabBarHidden

    var nativeContainerBackgroundColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            container.background = newValue?.toDrawable()
        }
    }

    internal var colorScheme: ColorScheme by container::colorScheme
    internal val currentFocusedTab: TabsScreenFragment by container::currentFocusedTab
    var tabBarRespectsIMEInsets: Boolean by container::tabBarRespectsIMEInsets

    init {
        addView(container)
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsHost [$id] attached to window")
        super.onAttachedToWindow()

        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.runContainerUpdate()
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
    }

    internal fun mountReactSubviewAt(
        tabsScreen: TabsScreen,
        index: Int,
    ) {
        val bottomNavigationViewMaxItemCount = container.bottomNavigationView.maxItemCount
        require(index < bottomNavigationViewMaxItemCount) {
            "[RNScreens] Attempt to insert TabsScreen at index $index; BottomNavigationView supports at most ${bottomNavigationViewMaxItemCount} items"
        }

        renderedScreens.add(index, tabsScreen)
        tabsScreen.setTabsScreenDelegate(container)

        val tabsScreenFragment = TabsScreenFragment(tabsScreen)
        container.tabsModel.add(index, tabsScreenFragment)

        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    internal fun unmountReactSubviewAt(index: Int) {
        renderedScreens.removeAt(index).also { tabsScreen ->
            container.tabsModel.removeAt(index)
            tabsScreen.setTabsScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountReactSubview(reactSubview: TabsScreen) {
        if (renderedScreens.removeIf { it === reactSubview }) {
            assert(container.tabsModel.removeIf { it.tabsScreen === reactSubview })
            reactSubview.setTabsScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.forEach { it.setTabsScreenDelegate(null) }
        renderedScreens.clear()

        // TODO: Remove this after refactor
        container.tabsModel.clear()

        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }


    private val layoutCallback =
        Choreographer.FrameCallback {
            isLayoutEnqueued = false
            forceSubtreeMeasureAndLayoutPass()
        }

    private fun refreshLayout() {
        @Suppress("SENSELESS_COMPARISON") // layoutCallback can be null here since this method can be called in init
        if (!isLayoutEnqueued && layoutCallback != null) {
            isLayoutEnqueued = true
            // we use NATIVE_ANIMATED_MODULE choreographer queue because it allows us to catch the current
            // looper loop instead of enqueueing the update in the next loop causing a one frame delay.
            ReactChoreographer
                .getInstance()
                .postFrameCallback(
                    ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
                    layoutCallback,
                )
        }
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

    companion object {
        const val TAG = "TabsHost"
    }
}
