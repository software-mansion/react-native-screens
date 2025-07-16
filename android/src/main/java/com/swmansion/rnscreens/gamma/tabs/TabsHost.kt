package com.swmansion.rnscreens.gamma.tabs

import android.R
import android.content.res.ColorStateList
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.children
import androidx.core.view.isVisible
import androidx.fragment.app.FragmentManager
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import kotlin.properties.Delegates

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

    var tabBarBackgroundColor: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemIconColor: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontFamily: String? by Delegates.observable<String?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemIconColorActive: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontColor: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontColorActive: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontSize: Float? by Delegates.observable(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontSizeActive: Float? by Delegates.observable(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontWeight: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemTitleFontStyle: String? by Delegates.observable(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    private fun <T> updateNavigationMenuIfNeeded(
        oldValue: T,
        newValue: T,
    ) {
        if (newValue != oldValue) {
            containerUpdateCoordinator.let {
                it.invalidateNavigationMenu()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

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
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // On Paper the children are not yet attached here.
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.runContainerUpdate()
            }
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

    override fun onMenuItemAttributesChange(tabScreen: TabScreen) {
        getMenuItemForTabScreen(tabScreen)?.let { menuItem ->
            updateMenuItemOfTabScreen(menuItem, tabScreen)
        }
    }

    override fun getFragmentForTabScreen(tabScreen: TabScreen): TabScreenFragment? = tabScreenFragments.find { it.tabScreen === tabScreen }

    private fun updateBottomNavigationViewAppearance() {
        Log.w(TAG, "updateBottomNavigationViewAppearance")

        bottomNavigationView.isVisible = true
        bottomNavigationView.setBackgroundColor(
            tabBarBackgroundColor ?: com.google.android.material.R.color.m3_sys_color_light_surface_container,
        )

        val states = arrayOf(intArrayOf(-R.attr.state_checked), intArrayOf(R.attr.state_checked))

        // Font color
        val fontInactiveColor = tabBarItemTitleFontColor ?: com.google.android.material.R.color.m3_tabs_text_color_secondary
        val fontActiveColor =
            tabBarItemTitleFontColorActive ?: tabBarItemTitleFontColor ?: com.google.android.material.R.color.m3_tabs_text_color
        val fontColors = intArrayOf(fontInactiveColor, fontActiveColor)
        bottomNavigationView.itemTextColor = ColorStateList(states, fontColors)

        // Icon color
        val iconInactiveColor = tabBarItemIconColor ?: com.google.android.material.R.color.m3_tabs_icon_color_secondary
        val iconActiveColor = tabBarItemIconColorActive ?: tabBarItemIconColor ?: com.google.android.material.R.color.m3_tabs_icon_color
        val iconColors = intArrayOf(iconInactiveColor, iconActiveColor)
        bottomNavigationView.itemIconTintList = ColorStateList(states, iconColors)

        // First clean the menu, then populate it
        bottomNavigationView.menu.clear()

        tabScreenFragments.forEachIndexed { index, fragment ->
            Log.d(TAG, "Add menu item: $index")
            val item =
                bottomNavigationView.menu.add(
                    Menu.NONE,
                    index,
                    Menu.NONE,
                    fragment.tabScreen.tabTitle,
                )

            item.icon = fragment.tabScreen.icon
        }

        // Update font styles
        updateFontStyles()

        bottomNavigationView.selectedItemId =
            checkNotNull(getSelectedTabScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }

        post {
            forceSubtreeMeasureAndLayoutPass()
            Log.d(TAG, "BottomNavigationView request layout")
        }
    }

    private fun updateFontStyles() {
        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        for (menuItem in bottomNavigationMenuView.children) {
            val largeLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_large_label_view)
            val smallLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_small_label_view)

            val isFontStyleItalic = tabBarItemTitleFontStyle == "italic"

            // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
            // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
            // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
            val fontWeight = if (tabBarItemTitleFontWeight == "bold") 700 else tabBarItemTitleFontWeight?.toIntOrNull() ?: 400

            val fontFamily =
                ReactFontManager.getInstance().getTypeface(
                    tabBarItemTitleFontFamily ?: "",
                    fontWeight,
                    isFontStyleItalic,
                    reactContext.assets,
                )

            val smallFontSize = tabBarItemTitleFontSize?.takeIf { it > 0 } ?: 12f
            val largeFontSize = tabBarItemTitleFontSizeActive?.takeIf { it > 0 } ?: 14f

            // Inactive
            smallLabel.textSize = smallFontSize
            smallLabel.typeface = fontFamily

            // Active
            largeLabel.textSize = largeFontSize
            largeLabel.typeface = fontFamily
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

    private fun getFragmentForMenuItemId(itemId: Int): TabScreenFragment? = tabScreenFragments.getOrNull(itemId)

    private fun getSelectedTabScreenFragmentId(): Int? {
        if (tabScreenFragments.isEmpty()) {
            return null
        }
        return checkNotNull(tabScreenFragments.indexOfFirst { it.tabScreen.isFocusedTab }) { "[RNScreens] There must be a focused tab" }
    }

    private fun getMenuItemForTabScreen(tabScreen: TabScreen): MenuItem? =
        tabScreenFragments.indexOfFirst { it.tabScreen === tabScreen }.takeIf { it != -1 }?.let { index ->
            bottomNavigationView.menu.findItem(index)
        }

    private fun updateMenuItemOfTabScreen(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        menuItem.title = tabScreen.tabTitle
        menuItem.icon = tabScreen.icon
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
