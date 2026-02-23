package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import android.os.Build
import android.view.Choreographer
import android.view.Gravity
import android.view.MenuItem
import android.view.View
import android.view.WindowInsets
import android.widget.FrameLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.graphics.drawable.toDrawable
import androidx.core.view.children
import androidx.fragment.app.FragmentManager
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewFinder
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.safearea.EdgeInsets
import com.swmansion.rnscreens.safearea.SafeAreaProvider
import com.swmansion.rnscreens.safearea.SafeAreaView
import com.swmansion.rnscreens.utils.RNSLog
import kotlin.properties.Delegates

class TabsHost(
    val reactContext: ThemedReactContext,
) : FrameLayout(reactContext),
    TabsScreenDelegate,
    SafeAreaProvider,
    View.OnLayoutChangeListener {
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
                a11yCoordinator.setA11yPropertiesToAllTabItems()
            }
        }
    }

    private inner class SpecialEffectsHandler {
        fun handleRepeatedTabSelection(): Boolean {
            val contentView = this@TabsHost.contentView
            val selectedTabFragment = this@TabsHost.currentFocusedTab
            if (selectedTabFragment.tabsScreen.shouldUseRepeatedTabSelectionPopToRootSpecialEffect) {
                val screenStack = ViewFinder.findScreenStackInFirstDescendantChain(contentView)
                if (screenStack != null && screenStack.popToRoot()) {
                    return true
                }
            }
            if (selectedTabFragment.tabsScreen.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect) {
                val scrollView = ViewFinder.findScrollViewInFirstDescendantChain(contentView)
                if (scrollView != null && scrollView.scrollY > 0) {
                    scrollView.smoothScrollTo(scrollView.scrollX, 0)
                    return true
                }
            }
            return false
        }
    }

    private val containerUpdateCoordinator = ContainerUpdateCoordinator()
    private val specialEffectsHandler = SpecialEffectsHandler()

    private val wrappedContext =
        ContextThemeWrapper(
            reactContext,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    private val bottomNavigationView: BottomNavigationView =
        BottomNavigationView(wrappedContext).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.WRAP_CONTENT,
                    Gravity.BOTTOM,
                )
        }

    private val contentView: FrameLayout =
        FrameLayout(reactContext).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT,
                )
            id = ViewIdGenerator.generateViewId()
        }

    internal lateinit var eventEmitter: TabsHostEventEmitter

    private var fragmentManager: FragmentManager? = null
    private val requireFragmentManager
        get() = checkNotNull(fragmentManager) { "[RNScreens] Nullish fragment manager" }

    private val tabsScreenFragments: MutableList<TabsScreenFragment> = arrayListOf()

    private val currentFocusedTab: TabsScreenFragment
        get() = checkNotNull(tabsScreenFragments.find { it.tabsScreen.isFocusedTab }) { "[RNScreens] No focused tab present" }

    private var lastAppliedUiMode: Int? = null

    private var isLayoutEnqueued: Boolean = false

    private var interfaceInsetsChangeListener: SafeAreaView? = null

    private val appearanceCoordinator =
        TabsHostAppearanceCoordinator(wrappedContext, bottomNavigationView, tabsScreenFragments)

    private val a11yCoordinator = TabsHostA11yCoordinator(bottomNavigationView, tabsScreenFragments)

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

    var tabBarHidden: Boolean by Delegates.observable(false) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            updateInterfaceInsets()
            updateNavigationMenuIfNeeded(oldValue, newValue)
        }
    }

    var nativeContainerBackgroundColor: Int? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            background = newValue?.toDrawable()
        }
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
            val repeatedSelectionHandledBySpecialEffect =
                if (fragment == currentFocusedTab) specialEffectsHandler.handleRepeatedTabSelection() else false
            val tabKey = fragment?.tabsScreen?.tabKey ?: "undefined"
            eventEmitter.emitOnNativeFocusChange(
                tabKey,
                item.itemId,
                repeatedSelectionHandledBySpecialEffect,
            )
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
        tabsScreen: TabsScreen,
        index: Int,
    ) {
        require(index < bottomNavigationView.maxItemCount) {
            "[RNScreens] Attempt to insert TabsScreen at index $index; BottomNavigationView supports at most ${bottomNavigationView.maxItemCount} items"
        }

        val tabsScreenFragment = TabsScreenFragment(tabsScreen)
        tabsScreenFragments.add(index, tabsScreenFragment)
        tabsScreen.setTabsScreenDelegate(this)
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    internal fun unmountReactSubviewAt(index: Int) {
        tabsScreenFragments.removeAt(index).also { fragment ->
            fragment.tabsScreen.setTabsScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountReactSubview(reactSubview: TabsScreen) {
        tabsScreenFragments.removeIf { it.tabsScreen === reactSubview }.takeIf { it }?.let {
            reactSubview.setTabsScreenDelegate(null)
            containerUpdateCoordinator.let {
                it.invalidateAll()
                it.postContainerUpdateIfNeeded()
            }
        }
    }

    internal fun unmountAllReactSubviews() {
        tabsScreenFragments.forEach { it.tabsScreen.setTabsScreenDelegate(null) }
        tabsScreenFragments.clear()
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    override fun onTabFocusChangedFromJS(
        tabsScreen: TabsScreen,
        isFocused: Boolean,
    ) {
        containerUpdateCoordinator.let {
            it.invalidateAll()
            it.postContainerUpdateIfNeeded()
        }
    }

    override fun onMenuItemAttributesChange(tabsScreen: TabsScreen) {
        getMenuItemForTabsScreen(tabsScreen)?.let { menuItem ->
            appearanceCoordinator.updateMenuItemAppearance(menuItem, tabsScreen)
            a11yCoordinator.setA11yPropertiesToTabItem(menuItem, tabsScreen)
        }
    }

    override fun getFragmentForTabsScreen(tabsScreen: TabsScreen): TabsScreenFragment? =
        tabsScreenFragments.find {
            it.tabsScreen ===
                tabsScreen
        }

    override fun onFragmentConfigurationChange(
        tabsScreen: TabsScreen,
        config: Configuration,
    ) {
        this.onConfigurationChanged(config)
    }

    private fun updateBottomNavigationViewAppearance() {
        RNSLog.d(TAG, "updateBottomNavigationViewAppearance")

        appearanceCoordinator.updateTabAppearance(this)

        val selectedTabsScreenFragmentId =
            checkNotNull(getSelectedTabsScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }
        if (bottomNavigationView.selectedItemId != selectedTabsScreenFragmentId) {
            bottomNavigationView.selectedItemId = selectedTabsScreenFragmentId
        }

        post {
            refreshLayout()
            RNSLog.d(TAG, "BottomNavigationView request layout")
        }
    }

    private fun updateSelectedTab() {
        val newFocusedTab = currentFocusedTab

        val tabFragments = requireFragmentManager.fragments.filterIsInstance<TabsScreenFragment>()
        check(tabFragments.size <= 1) { "[RNScreens] There can be only a single focused tab" }
        val oldFocusedTab = tabFragments.firstOrNull()

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

    private fun getFragmentForMenuItemId(itemId: Int): TabsScreenFragment? = tabsScreenFragments.getOrNull(itemId)

    private fun getSelectedTabsScreenFragmentId(): Int? {
        if (tabsScreenFragments.isEmpty()) {
            return null
        }
        return checkNotNull(tabsScreenFragments.indexOfFirst { it.tabsScreen.isFocusedTab }) { "[RNScreens] There must be a focused tab" }
    }

    private fun getMenuItemForTabsScreen(tabsScreen: TabsScreen): MenuItem? =
        tabsScreenFragments
            .indexOfFirst { it.tabsScreen === tabsScreen }
            .takeIf { it != -1 }
            ?.let { index ->
                bottomNavigationView.menu.findItem(index)
            }

    override fun setOnInterfaceInsetsChangeListener(listener: SafeAreaView) {
        if (interfaceInsetsChangeListener == null) {
            bottomNavigationView.addOnLayoutChangeListener(this)
        }
        interfaceInsetsChangeListener = listener
    }

    override fun removeOnInterfaceInsetsChangeListener(listener: SafeAreaView) {
        if (interfaceInsetsChangeListener == listener) {
            interfaceInsetsChangeListener = null
            bottomNavigationView.removeOnLayoutChangeListener(this)
        }
    }

    override fun getInterfaceInsets(): EdgeInsets = EdgeInsets(0.0f, 0.0f, 0.0f, bottomNavigationView.height.toFloat())

    override fun dispatchApplyWindowInsets(insets: WindowInsets?): WindowInsets? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            return super.dispatchApplyWindowInsets(insets)
        }

        // On Android versions prior to R, insets dispatch is broken.
        // In order to mitigate this, we override dispatchApplyWindowInsets with
        // correct implementation. To simplify it, we skip the call to TabsHost's
        // onApplyWindowInsets.
        if (insets?.isConsumed ?: true) {
            return insets
        }

        for (child in children) {
            child.dispatchApplyWindowInsets(insets)
        }

        return insets
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] TabsHost must have its tag set when registering event emitters" }
        eventEmitter = TabsHostEventEmitter(reactContext, id)
    }

    override fun onLayoutChange(
        view: View?,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        oldLeft: Int,
        oldTop: Int,
        oldRight: Int,
        oldBottom: Int,
    ) {
        require(view is BottomNavigationView) {
            "[RNScreens] TabsHost's onLayoutChange expects BottomNavigationView, received $view instead"
        }

        val oldHeight = oldBottom - oldTop
        val newHeight = bottom - top

        if (newHeight != oldHeight) {
            updateInterfaceInsets(newHeight)
        }
    }

    private fun updateInterfaceInsets(newHeight: Int? = null) {
        val height = if (tabBarHidden) 0 else (newHeight ?: bottomNavigationView.height)

        interfaceInsetsChangeListener?.apply {
            this.onInterfaceInsetsChange(EdgeInsets(0.0f, 0.0f, 0.0f, height.toFloat()))
        }
    }

    companion object {
        const val TAG = "TabsHost"
    }
}
