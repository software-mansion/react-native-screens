package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import android.view.Choreographer
import android.view.MenuItem
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.fragment.app.FragmentManager
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.utils.RNSLog
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

    private val wrappedContext =
        ContextThemeWrapper(
            reactContext,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    private val bottomNavigationView: BottomNavigationView =
        BottomNavigationView(wrappedContext).apply {
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
            id = ViewIdGenerator.generateViewId()
        }

    internal lateinit var eventEmitter: TabsHostEventEmitter

    private var fragmentManager: FragmentManager? = null
    private val requireFragmentManager
        get() = checkNotNull(fragmentManager) { "[RNScreens] Nullish fragment manager" }

    private val tabScreenFragments: MutableList<TabScreenFragment> = arrayListOf()

    private var lastAppliedUiMode: Int? = null

    private var isLayoutEnqueued: Boolean = false

    private val appearanceCoordinator =
        TabsHostAppearanceCoordinator(wrappedContext, bottomNavigationView, tabScreenFragments)

    var tabBarBackgroundColor: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemActiveIndicatorColor: Int? by Delegates.observable<Int?>(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var isTabBarItemActiveIndicatorEnabled: Boolean by Delegates.observable(true) { _, oldValue, newValue ->
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

    var tabBarItemRippleColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        updateNavigationMenuIfNeeded(oldValue, newValue)
    }

    var tabBarItemLabelVisibilityMode: String? by Delegates.observable(null) { _, oldValue, newValue ->
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
        addView(contentView)
        addView(bottomNavigationView)

        bottomNavigationView.addOnLayoutChangeListener { view, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
            RNSLog.d(
                TAG,
                "BottomNavigationView layout changed {$left, $top} {${right - left}, ${bottom - top}}",
            )
        }

        bottomNavigationView.setOnItemSelectedListener { item ->
            RNSLog.d(TAG, "Item selected $item")
            val fragment = getFragmentForMenuItemId(item.itemId)
            val tabKey = fragment?.tabScreen?.tabKey ?: "undefined"
            eventEmitter.emitOnNativeFocusChange(tabKey)
            true
        }
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsHost [$id] attached to window")
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
        tabScreenFragments.removeAt(index).also { fragment ->
            fragment.tabScreen.setTabScreenDelegate(null)
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
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    override fun onMenuItemAttributesChange(tabScreen: TabScreen) {
        getMenuItemForTabScreen(tabScreen)?.let { menuItem ->
            appearanceCoordinator.updateMenuItemAppearance(menuItem, tabScreen)
        }
    }

    override fun getFragmentForTabScreen(tabScreen: TabScreen): TabScreenFragment? = tabScreenFragments.find { it.tabScreen === tabScreen }

    override fun onFragmentConfigurationChange(
        tabScreen: TabScreen,
        config: Configuration,
    ) {
        this.onConfigurationChanged(config)
    }

    private fun updateBottomNavigationViewAppearance() {
        RNSLog.d(TAG, "updateBottomNavigationViewAppearance")

        appearanceCoordinator.updateTabAppearance(this)

        bottomNavigationView.selectedItemId =
            checkNotNull(getSelectedTabScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }

        post {
            refreshLayout()
            RNSLog.d(TAG, "BottomNavigationView request layout")
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

        requireFragmentManager
            .beginTransaction()
            .setReorderingAllowed(true)
            .apply {
                if (oldFocusedTab != null) {
                    this.remove(oldFocusedTab)
                }
                this.add(contentView.id, newFocusedTab)
            }.commitNowAllowingStateLoss()
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

    override fun onConfigurationChanged(newConfig: Configuration?) {
        super.onConfigurationChanged(newConfig)

        newConfig?.let {
            applyDayNightUiModeIfNeeded(it.uiMode and Configuration.UI_MODE_NIGHT_MASK)
        }
    }

    private fun applyDayNightUiModeIfNeeded(uiMode: Int) {
        if (uiMode != lastAppliedUiMode) {
            // update the appearance when user toggles between dark/light mode
            when (uiMode) {
                Configuration.UI_MODE_NIGHT_YES -> {
                    wrappedContext.setTheme(com.google.android.material.R.style.Theme_Material3_Dark_NoActionBar)
                }

                Configuration.UI_MODE_NIGHT_NO -> {
                    wrappedContext.setTheme(com.google.android.material.R.style.Theme_Material3_Light_NoActionBar)
                }

                else -> {
                    wrappedContext.setTheme(com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar)
                }
            }

            appearanceCoordinator.updateTabAppearance(this)
            lastAppliedUiMode = uiMode
        }
    }

    private fun forceSubtreeMeasureAndLayoutPass() {
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
        tabScreenFragments
            .indexOfFirst { it.tabScreen === tabScreen }
            .takeIf { it != -1 }
            ?.let { index ->
                bottomNavigationView.menu.findItem(index)
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
