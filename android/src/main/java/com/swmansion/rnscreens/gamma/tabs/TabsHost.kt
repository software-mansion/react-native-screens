package com.swmansion.rnscreens.gamma.tabs

import android.graphics.Color
import android.util.Log
import android.view.Menu
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.core.view.isVisible
import androidx.fragment.app.FragmentManager
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper

class TabsHost(
    val reactContext: ThemedReactContext,
) : LinearLayout(reactContext),
    TabScreenDelegate {
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

        private var isSelectedTabInvalidated: Boolean = false
        private var isBottomNavigationMenuInvalidated: Boolean = false

        fun invalidateSelectedTab() {
            isSelectedTabInvalidated = true
        }

        fun invalidateNavigationMenu() {
            isBottomNavigationMenuInvalidated = true
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
            if (isSelectedTabInvalidated) {
                isSelectedTabInvalidated = false
                this@TabsHost.updateSelectedTab()
            }
            if (isBottomNavigationMenuInvalidated) {
                isBottomNavigationMenuInvalidated = false
                this@TabsHost.updateBottomNavigationViewAppearance()
            }
        }
    }

    private val containerUpdateCoordinator = ContainerUpdateCoordinator()

    private val bottomNavigationView: BottomNavigationView =
        BottomNavigationView(reactContext).apply {
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
        }

    private val contentView: FrameLayout =
        FrameLayout(reactContext).apply {
            layoutParams =
                LinearLayout
                    .LayoutParams(
                        LayoutParams.MATCH_PARENT,
                        LayoutParams.WRAP_CONTENT,
                    ).apply {
                        weight = 1f
                    }
            id = generateViewId()
        }

    internal lateinit var eventEmitter: TabsHostEventEmitter

    private var fragmentManager: FragmentManager? = null
    private val requireFragmentManager
        get() = checkNotNull(fragmentManager) { "[RNScreens] Nullish fragment manager" }

    private val tabScreenFragments: MutableList<TabScreenFragment> = arrayListOf()

    private var isLayoutInvalidated: Boolean = false

    init {
        orientation = VERTICAL
        bottomNavigationView.labelVisibilityMode = NavigationBarView.LABEL_VISIBILITY_LABELED
        addView(contentView)
        addView(bottomNavigationView)

        bottomNavigationView.addOnLayoutChangeListener { view, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
            Log.d(
                TAG,
                "BottomNavigationView layout changed {$left, $top} {${right - left}, ${bottom - top}}",
            )
        }

        bottomNavigationView.setOnItemSelectedListener { item ->
            Log.d(TAG, "Item selected $item")
            val fragment = getFragmentForMenuItemId(item.itemId)
            val tabKey = fragment?.tabScreen?.tabKey ?: "undefined"
            eventEmitter.emitOnNativeFocusChange(tabKey)
            true
        }
    }

    override fun onAttachedToWindow() {
        Log.d(TAG, "TabsHost [$id] attached to window")
        super.onAttachedToWindow()
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.runContainerUpdate()
        }
    }

    internal fun mountReactSubviewAt(
        tabScreen: TabScreen,
        index: Int,
    ) {
        require(index < bottomNavigationView.maxItemCount) {
            "[RNScreens] Attempt to insert TabScreen at index $index; BottomNavigationView supports at most ${bottomNavigationView.maxItemCount} items"
        }

        val tabScreenFragment = TabScreenFragment(tabScreen)
        tabScreenFragments.add(index, tabScreenFragment)
        tabScreen.setTabScreenDelegate(this)
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    internal fun unmountReactSubviewAt(index: Int) {
        tabScreenFragments.removeAt(index).also {
            it.tabScreen.setTabScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountReactSubview(reactSubview: TabScreen) {
        tabScreenFragments.removeIf { it.tabScreen === reactSubview }.takeIf { it }?.let {
            reactSubview.setTabScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountAllReactSubviews() {
        tabScreenFragments.forEach { it.tabScreen.setTabScreenDelegate(null) }
        tabScreenFragments.clear()
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    override fun onTabFocusChangedFromJS(
        tabScreen: TabScreen,
        isFocused: Boolean,
    ) {
        containerUpdateCoordinator.let {
            it.invalidateSelectedTab()
            it.postContainerUpdateIfNeeded()
        }
    }

    private fun updateBottomNavigationViewAppearance() {
        Log.w(TAG, "updateBottomNavigationViewAppearance")
        bottomNavigationView.isVisible = true
        bottomNavigationView.setBackgroundColor(Color.RED)

        // First clean the menu, then populate it
        bottomNavigationView.menu.clear()

        tabScreenFragments.forEachIndexed { index, fragment ->
            Log.d(TAG, "Add menu item: $index")
            val item = bottomNavigationView.menu.add(Menu.NONE, index, Menu.NONE, "Tab $index")
            item.setIcon(android.R.drawable.sym_action_chat)
        }

        bottomNavigationView.selectedItemId =
            checkNotNull(getSelectedTabScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }

        post {
            forceSubtreeMeasureAndLayoutPass()
            Log.d(TAG, "BottomNavigationView request layout")
        }
    }

    private fun updateSelectedTab() {
        val newFocusedTab =
            checkNotNull(tabScreenFragments.find { it.tabScreen.isFocusedTab }) { "[RNScreens] No focused tab present" }

        check(requireFragmentManager.fragments.size <= 1) { "[RNScreens] There can be only a single focused tab" }
        val oldFocusedTab = requireFragmentManager.fragments.firstOrNull()

        if (newFocusedTab === oldFocusedTab) {
            return
        }

        if (oldFocusedTab == null) {
            requireFragmentManager
                .beginTransaction()
                .setReorderingAllowed(true)
                .apply {
                    this.add(contentView.id, newFocusedTab)
                }.commitNowAllowingStateLoss()
        } else {
            requireFragmentManager
                .beginTransaction()
                .setReorderingAllowed(true)
                .apply {
                    this.remove(oldFocusedTab)
                    this.add(contentView.id, newFocusedTab)
                }.commitNowAllowingStateLoss()
        }
    }

    private fun forceSubtreeMeasureAndLayoutPass() {
        isLayoutInvalidated = false

        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
        )

        layout(left, top, right, bottom)
    }

    private fun getFragmentForMenuItemId(itemId: Int): TabScreenFragment? =
        tabScreenFragments.getOrNull(itemId)

    private fun getSelectedTabScreenFragmentId(): Int? {
        if (tabScreenFragments.isEmpty()) {
            return null
        }
        return checkNotNull(tabScreenFragments.indexOfFirst { it.tabScreen.isFocusedTab }) { "[RNScreens] There must be a focused tab" }
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
