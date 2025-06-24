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

    private var hasPendingUpdate: Boolean = false
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
        Log.d(TAG, "TabsHost attached to window")
        super.onAttachedToWindow()
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }

        hasPendingUpdate = true
        updateContainer()
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
        scheduleContainerUpdate()
    }

    internal fun unmountReactSubviewAt(index: Int) {
        tabScreenFragments.removeAt(index).also {
            it.tabScreen.setTabScreenDelegate(null)
            scheduleContainerUpdate()
        }
    }

    internal fun unmountReactSubview(reactSubview: TabScreen) {
        tabScreenFragments.removeIf { it.tabScreen === reactSubview }.takeIf { it }?.let {
            reactSubview.setTabScreenDelegate(null)
            scheduleContainerUpdate()
        }
    }

    internal fun unmountAllReactSubviews() {
        tabScreenFragments.forEach { it.tabScreen.setTabScreenDelegate(null) }
        tabScreenFragments.clear()
        scheduleContainerUpdate()
    }

    override fun onTabFocusChangedFromJS(
        tabScreen: TabScreen,
        isFocused: Boolean,
    ) {
        scheduleContainerUpdate()
    }

    private fun updateBottomNavigationViewAppearance() {
        bottomNavigationView.isVisible = true
        bottomNavigationView.setBackgroundColor(Color.RED)

        // First clean the menu, then populate it
        bottomNavigationView.menu.clear()

        tabScreenFragments.forEachIndexed { index, fragment ->
            Log.d(TAG, "Add menu item")
            val item = bottomNavigationView.menu.add(Menu.NONE, index, Menu.NONE, "Tab $index")
            item.isEnabled = true
            item.isVisible = true
            item.setIcon(android.R.drawable.sym_action_chat)
        }

        bottomNavigationView.selectedItemId =
            checkNotNull(getSelectedTabScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }

        post {
            forceSubtreeMeasureAndLayoutPass()
            Log.d(TAG, "BottomNavigationView request layout")
        }
    }

    private fun updateFocusedView() {
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

    private fun updateContainer() {
        if (!hasPendingUpdate) {
            return
        }
        hasPendingUpdate = false
        updateFocusedView()
        updateBottomNavigationViewAppearance()
    }

    private fun scheduleContainerUpdate() {
        hasPendingUpdate = true
        post {
            updateContainer()
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

    private fun getFragmentForMenuItemId(itemId: Int): TabScreenFragment? = tabScreenFragments.getOrNull(itemId)

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
