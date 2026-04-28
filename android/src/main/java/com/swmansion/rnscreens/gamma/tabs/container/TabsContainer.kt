package com.swmansion.rnscreens.gamma.tabs.container

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.view.Gravity
import android.view.MenuItem
import android.view.View
import android.view.WindowInsets
import android.widget.FrameLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.graphics.Insets
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.children
import androidx.core.view.size
import androidx.fragment.app.FragmentManager
import com.google.android.material.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorSchemeCoordinator
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorSchemeListener
import com.swmansion.rnscreens.gamma.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewFinder
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.gamma.helpers.createTransactionWithReordering
import com.swmansion.rnscreens.gamma.tabs.appearance.TabsAppearanceCoordinator
import com.swmansion.rnscreens.gamma.tabs.host.TabsHost
import com.swmansion.rnscreens.gamma.tabs.host.TabsHostA11yCoordinator
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenDelegate
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment
import com.swmansion.rnscreens.safearea.EdgeInsets
import com.swmansion.rnscreens.safearea.SafeAreaProvider
import com.swmansion.rnscreens.safearea.SafeAreaView
import com.swmansion.rnscreens.utils.RNSLog
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor") // Created only by us. Should never be restored.
internal class TabsContainer(
    private val context: Context,
    private val delegate: TabsContainerDelegate,
) : FrameLayout(context),
    ColorSchemeProviding,
    TabsScreenDelegate,
    SafeAreaProvider,
    View.OnLayoutChangeListener {
    init {
        id = ViewIdGenerator.generateViewId()
    }

    private inner class SpecialEffectsHandler {
        fun handleRepeatedTabSelection(): Boolean {
            val contentView = this@TabsContainer.contentView
            val selectedTabFragment = this@TabsContainer.selectedTab
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

    private var navState: TabsNavState = TabsNavState.EMPTY
    private var lastUINavState: TabsNavState = TabsNavState.EMPTY
    private val tabsModel: MutableList<TabsScreenFragment> = arrayListOf()
    internal var rejectOpsWithStaleNavState: Boolean = false

    internal val selectedTab: TabsScreenFragment
        get() =
            checkNotNull(getFragmentForScreenKey(navState.selectedKey)) { "[RNScreens] No selected tab present" }

    internal val invalidationFlags = TabsContainerInvalidationFlags()

    private var pendingOperation: TabsContainerOp? = null
    internal val hasPendingOperation
        get() = pendingOperation != null

    /**
     * Denotes whether container is currently performing update triggered by the `pendingOperation`.
     */
    private var isInExternalOperationContext: Boolean = false

    private var fragmentManager: FragmentManager? = null
    private val requireFragmentManager: FragmentManager
        get() = checkNotNull(fragmentManager) { "[RNScreens] Attempt to use nullish FragmentManager" }

    private val themedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    internal val bottomNavigationView: BottomNavigationView =
        BottomNavigationView(themedContext).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.WRAP_CONTENT,
                    Gravity.BOTTOM,
                )
        }

    private val specialEffectsHandler = SpecialEffectsHandler()
    private val colorSchemeCoordinator = ColorSchemeCoordinator()

    internal var colorScheme: ColorScheme by colorSchemeCoordinator::colorScheme
    internal var tabBarRespectsIMEInsets: Boolean = false

    private val contentView: FrameLayout =
        FrameLayout(context).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT,
                )
            id = ViewIdGenerator.generateViewId()
        }

    private val appearanceCoordinator =
        TabsAppearanceCoordinator(bottomNavigationView, tabsModel)

    private val a11yCoordinator = TabsHostA11yCoordinator(bottomNavigationView, tabsModel)

    private var interfaceInsetsChangeListener: SafeAreaView? = null

    internal var tabBarHidden: Boolean by Delegates.observable(false) { _, oldValue, newValue ->
        if (newValue != oldValue) {
            updateInterfaceInsets()
            invalidationFlags.isNavigationMenuAppearanceInvalidated = true
            post {
                performContainerUpdateIfNeeded()
            }
//            updateNavigationMenuIfNeeded(oldValue, newValue)
        }
    }

    init {
        addView(contentView)
        addView(bottomNavigationView)

        bottomNavigationView.setOnItemSelectedListener(this::onMenuItemSelected)
        invalidationFlags.invalidateAll()
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsContainer [$id] attached to window")

        super.onAttachedToWindow()
        setupFragmentManager()
        performContainerUpdateIfNeeded()

        colorSchemeCoordinator.setup(this) { uiNightMode ->
            applyDayNightUiMode(uiNightMode)
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        teardownFragmentManager()
    }

    override fun onConfigurationChanged(newConfig: Configuration?) {
        super.onConfigurationChanged(newConfig)
        colorSchemeCoordinator.onConfigurationChanged(newConfig)
    }

    override fun dispatchApplyWindowInsets(insets: WindowInsets?): WindowInsets? {
        // On Android versions prior to R, insets dispatch is broken.
        // In order to mitigate this, we override dispatchApplyWindowInsets with
        // correct implementation. To simplify it, we skip the call to TabsHost's
        // onApplyWindowInsets. We also use this method to dispatch different insets to
        // BottomNavigationView so that IME inset can be controlled via prop.
        if (insets?.isConsumed ?: true) {
            return insets
        }

        for (child in children) {
            if (child === bottomNavigationView) {
                val insetsForBottomNavigationView = getInsetsForBottomNavigationView(insets)
                child.dispatchApplyWindowInsets(insetsForBottomNavigationView)
            } else {
                child.dispatchApplyWindowInsets(insets)
            }
        }

        return insets
    }

    internal fun setContainerOperation(op: TabsContainerOp) {
        pendingOperation = op
        invalidationFlags.isSelectedTabInvalidated = true
    }

    internal fun addTabsScreenAt(
        index: Int,
        tabsScreen: TabsScreen,
    ) {
        tabsModel.add(index, TabsScreenFragment(tabsScreen))
        invalidationFlags.invalidateAll()
    }

    internal fun removeTabsScreenAt(index: Int): TabsScreen? =
        tabsModel.removeAt(index).tabsScreen.also {
            invalidationFlags.invalidateAll()
        }

    internal fun removeTabsScreen(tabsScreen: TabsScreen): Boolean =
        tabsModel.removeIf { it.tabsScreen === tabsScreen }.also { isRemoved ->
            if (isRemoved) invalidationFlags.invalidateAll()
        }

    internal fun removeAllTabsScreens() {
        tabsModel.clear()
        invalidationFlags.invalidateAll()
    }

    internal fun performContainerUpdateIfNeeded() {
        if (invalidationFlags.any() && isAttachedToWindow) {
            performContainerUpdate()
        }
    }

    private fun performContainerUpdate() {
        if (invalidationFlags.isNavigationMenuStructureInvalidated) {
            invalidationFlags.isNavigationMenuStructureInvalidated = false
            updateNavigationMenuStructure()
        }

        if (invalidationFlags.isSelectedTabInvalidated) {
            invalidationFlags.isSelectedTabInvalidated = false
            performOperation()
        }

        if (invalidationFlags.isNavigationMenuAppearanceInvalidated) {
            invalidationFlags.isNavigationMenuAppearanceInvalidated = false
            this.updateBottomNavigationViewAppearance()
            a11yCoordinator.setA11yPropertiesToAllTabItems()
        }
    }

    private fun performOperation() {
        if (pendingOperation == null) {
            RNSLog.w(TAG, "TabsContainer::performOperation called w/o pending operation; skipping update")
            return
        }

        check(hasPendingOperation) { "[RNScreens] Attempt to update container with empty state and no pending update" }
        check(pendingOperation is TabSelectOp)
        val tabSelectOp = pendingOperation as TabSelectOp

        val nextSelectedMenuItemId =
            checkNotNull(getMenuItemIdForFragment(requireFragmentForScreenKey(tabSelectOp.navState.selectedKey))) {
                "[RNScreens] Failed to find Menu Item for screenKey: ${tabSelectOp.navState.selectedKey}"
            }

        if (rejectOpsWithStaleNavState && isNavStateStale(tabSelectOp.navState)) {
            delegate.onNavStateUpdateRejected(
                navState,
                tabSelectOp.navState,
                TabsNavStateUpdateRejectionReason.STALE,
            )
            pendingOperation = null
            return
        }

        if (bottomNavigationView.selectedItemId != nextSelectedMenuItemId || navState.isEmpty()) {
            isInExternalOperationContext = true
            // This triggers on OnMenuItemClicked callback, where we perform actual update from
            bottomNavigationView.selectedItemId = nextSelectedMenuItemId
            isInExternalOperationContext = false
        } else {
            delegate.onNavStateUpdateRejected(
                navState,
                tabSelectOp.navState,
                TabsNavStateUpdateRejectionReason.REPEATED,
            )
        }

        pendingOperation = null
    }

    private fun updateNavigationMenuStructure() {
        if (bottomNavigationView.menu.size != tabsModel.size) {
            // Most likely first render or some tab has been removed. Let's nuke the menu (easiest option).
            bottomNavigationView.menu.clear()
        }
        tabsModel.forEachIndexed { index, fragment ->
            val menuItem =
                bottomNavigationView.menu.getOrCreateMenuItemForFragmentAt(
                    index,
                    fragment.tabsScreen,
                )
            check(fragmentIndexForMenuItemId(menuItem.itemId) == index) { "[RNScreens] Illegal state: menu items are shuffled" }
        }
    }

    private fun updateBottomNavigationViewAppearance() {
        RNSLog.d(TAG, "updateBottomNavigationViewAppearance")

        appearanceCoordinator.updateTabAppearance(themedContext, this)

        post {
            requestLayout()
        }
    }

    private fun updateSelectedFragment(nextSelectedFragment: TabsScreenFragment): Boolean {
        if (navState.isEmpty()) {
            check(isInExternalOperationContext && hasPendingOperation)
            navState = TabsNavState(nextSelectedFragment.requireScreenKey, 0)
            requireFragmentManager
                .createTransactionWithReordering()
                .add(contentView.id, nextSelectedFragment)
                .commitNowAllowingStateLoss()
            return true
        }

        val currentSelectedFragment = selectedTab

        if (nextSelectedFragment === currentSelectedFragment) {
            progressNavigationState(navState.selectedKey)
            return true
        }

        progressNavigationState(nextSelectedFragment.requireScreenKey)
        requireFragmentManager
            .createTransactionWithReordering()
            .let {
                it.remove(currentSelectedFragment)
                it.add(contentView.id, nextSelectedFragment)
            }.commitNowAllowingStateLoss()

        return true
    }

    private fun progressNavigationState(selectedKey: String) {
        navState = TabsNavState(selectedKey, navState.provenance + 1)
        if (!isInExternalOperationContext) {
            lastUINavState = navState
        }
    }

    private fun onMenuItemSelected(item: MenuItem): Boolean {
        RNSLog.d(TabsHost.Companion.TAG, "Item selected $item")

        val currSelectedFragment = if (navState.isNotEmpty()) selectedTab else null
        val nextSelectedFragment =
            checkNotNull(getFragmentForMenuItemId(item.itemId)) {
                "[RNScreens] Can not select item with id: ${item.itemId} - associated fragment does not exist"
            }

        val isRepeated = nextSelectedFragment === currSelectedFragment

        // If this is user action we test whether it should be prevented before we progress the state.
        if (!isRepeated && !isInExternalOperationContext && nextSelectedFragment.isPreventNativeSelectionEnabled) {
            delegate.onNavStateUpdatePrevented(navState, nextSelectedFragment.requireScreenKey)
            return false
        }

        val stateChanged = updateSelectedFragment(nextSelectedFragment)

        val hasTriggeredSpecialEffect =
            if (isRepeated) specialEffectsHandler.handleRepeatedTabSelection() else false

        if (stateChanged) {
            delegate.onNavStateUpdate(
                navState,
                isRepeated = isRepeated,
                hasTriggeredSpecialEffect = hasTriggeredSpecialEffect,
                actionOrigin = if (isInExternalOperationContext) TabsActionOrigin.PROGRAMMATIC_JS else TabsActionOrigin.USER,
            )
        }

        // Block other callbacks
        return true
    }

    private fun applyDayNightUiMode(uiMode: Int) {
        // update the appearance when user toggles between dark/light mode
        when (uiMode) {
            Configuration.UI_MODE_NIGHT_YES -> {
                themedContext.setTheme(R.style.Theme_Material3_Dark_NoActionBar)
            }

            Configuration.UI_MODE_NIGHT_NO -> {
                themedContext.setTheme(R.style.Theme_Material3_Light_NoActionBar)
            }

            else -> {
                themedContext.setTheme(R.style.Theme_Material3_DayNight_NoActionBar)
            }
        }

        appearanceCoordinator.updateTabAppearance(themedContext, this)
    }

    private fun getFragmentForMenuItemId(itemId: Int): TabsScreenFragment? = tabsModel.getOrNull(fragmentIndexForMenuItemId(itemId))

    private fun getMenuItemIdForFragment(tabsScreenFragment: TabsScreenFragment): Int? =
        tabsModel.indexOfFirst { it === tabsScreenFragment }.takeIf { it != -1 }?.let {
            menuItemIdForFragmentAtIndex(it)
        }

    private fun getSelectedTabsScreenFragmentId(): Int? =
        tabsModel
            .indexOfFirst { it.requireScreenKey == navState.selectedKey }
            .takeIf { it != -1 }

    private fun getMenuItemForTabsScreen(tabsScreen: TabsScreen): MenuItem? =
        tabsModel
            .indexOfFirst { it.tabsScreen === tabsScreen }
            .takeIf { it != -1 }
            ?.let { index ->
                bottomNavigationView.menu.findItem(menuItemIdForFragmentAtIndex(index))
            }

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.removeColorSchemeListener(listener)

    override fun onAppearanceChanged(tabsScreen: TabsScreen) {
        if (selectedTab.tabsScreen === tabsScreen) {
            invalidationFlags.isNavigationMenuAppearanceInvalidated = true
            post {
                this.performContainerUpdateIfNeeded()
            }
        }
    }

    override fun onMenuItemAttributesChange(tabsScreen: TabsScreen) {
        getMenuItemForTabsScreen(tabsScreen)?.let { menuItem ->
            val appearance = selectedTab.tabsScreen.appearance
            appearanceCoordinator.updateMenuItemAppearance(
                themedContext,
                menuItem,
                tabsScreen,
                appearance,
            )
            a11yCoordinator.setA11yPropertiesToTabItem(menuItem, tabsScreen)
        }
    }

    override fun getFragmentForTabsScreen(tabsScreen: TabsScreen): TabsScreenFragment? =
        tabsModel.find {
            it.tabsScreen ===
                tabsScreen
        }

    private fun getFragmentForScreenKey(screenKey: String): TabsScreenFragment? = tabsModel.find { it.requireScreenKey == screenKey }

    private fun requireFragmentForScreenKey(screenKey: String): TabsScreenFragment =
        checkNotNull(getFragmentForScreenKey(screenKey)) {
            "[RNScreens] Requested fragment for key: $screenKey does not exist"
        }

    override fun onFragmentConfigurationChange(
        tabsScreen: TabsScreen,
        config: Configuration,
    ) {
        this.onConfigurationChanged(config)
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
            "[RNScreens] TabsContainer's onLayoutChange expects BottomNavigationView, received $view instead"
        }

        val oldHeight = oldBottom - oldTop
        val newHeight = bottom - top

        if (newHeight != oldHeight) {
            updateInterfaceInsets(newHeight)
        }
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

    private fun updateInterfaceInsets(newHeight: Int? = null) {
        val height = if (tabBarHidden) 0 else (newHeight ?: bottomNavigationView.height)

        interfaceInsetsChangeListener?.apply {
            this.onInterfaceInsetsChange(EdgeInsets(0.0f, 0.0f, 0.0f, height.toFloat()))
        }
    }

    override fun getInterfaceInsets(): EdgeInsets = EdgeInsets(0.0f, 0.0f, 0.0f, bottomNavigationView.height.toFloat())

    private fun getInsetsForBottomNavigationView(insets: WindowInsets): WindowInsets? {
        if (tabBarRespectsIMEInsets) {
            return insets
        }

        val compatInsets = WindowInsetsCompat.toWindowInsetsCompat(insets, this)

        return WindowInsetsCompat
            .Builder(compatInsets)
            .setInsets(WindowInsetsCompat.Type.ime(), Insets.NONE)
            .build()
            .toWindowInsets()
    }

    internal fun setupFragmentManager() {
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }
    }

    internal fun teardownFragmentManager() {
        fragmentManager = null
    }

    private fun isNavStateStale(state: TabsNavState): Boolean {
        if (navState.isEmpty() || lastUINavState.isEmpty()) return false
        return state.provenance < lastUINavState.provenance
    }

    companion object {
        const val TAG = "TabsContainer"
    }
}

internal class TabsContainerInvalidationFlags(
    var isSelectedTabInvalidated: Boolean = false,
    var isNavigationMenuAppearanceInvalidated: Boolean = false,
    var isNavigationMenuStructureInvalidated: Boolean = false,
) {
    internal fun any(): Boolean = isSelectedTabInvalidated || isNavigationMenuAppearanceInvalidated || isNavigationMenuStructureInvalidated

    internal fun invalidateAll() {
        isSelectedTabInvalidated = true
        isNavigationMenuAppearanceInvalidated = true
        isNavigationMenuStructureInvalidated = true
    }
}
