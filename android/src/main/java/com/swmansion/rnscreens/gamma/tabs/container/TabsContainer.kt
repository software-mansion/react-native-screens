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

/**
 * View that hosts the bottom navigation bar and the currently selected tab's content.
 *
 * Public API surface (the only contract third-party native consumers should rely on) is
 * grouped under the `Public API` region below. Members in `Host-internal API` and other
 * regions are implementation detail — the host (`TabsHost`) is the only intended caller
 * and these can change without notice.
 */
@SuppressLint("ViewConstructor") // Created only by us. Should never be restored.
class TabsContainer internal constructor(
    private val context: Context,
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

    private var navState: TabsNavigationState = TabsNavigationState.EMPTY
    private var lastUINavState: TabsNavigationState = TabsNavigationState.EMPTY
    private val tabsModel: MutableList<TabsScreenFragment> = arrayListOf()

    internal var rejectStaleNavigationStateUpdates: Boolean = false

    internal val selectedTab: TabsScreenFragment
        get() =
            checkNotNull(getFragmentForScreenKey(navState.selectedScreenKey)) { "[RNScreens] No selected tab present" }

    internal val invalidationFlags = TabsContainerInvalidationFlags()

    private var pendingStateUpdateRequest: TabsNavigationStateUpdateRequest? = null

    private fun requirePendingStateUpdateRequest(): TabsNavigationStateUpdateRequest =
        checkNotNull(pendingStateUpdateRequest) { "[RNScreens] Attempt to require nullish pendingStateUpdateRequest" }

    /**
     * Denotes whether container is currently performing update triggered by the `pendingStateUpdateRequest`.
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

    private val observerRegistry = TabsNavigationStateObserverRegistry()

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
                flushPendingUpdates()
            }
        }
    }

    init {
        addView(contentView)
        addView(bottomNavigationView)

        bottomNavigationView.setOnItemSelectedListener(this::onMenuItemSelected)
        invalidationFlags.invalidateAll()
    }

    // region Public API (third-party stable)

    /**
     * Current navigation state of the container.
     * Returns [TabsNavigationState.EMPTY] before the first tab is selected.
     */
    val navigationState: TabsNavigationState
        get() = navState

    /**
     * Queue a navigation state update. Apply via [flushPendingUpdates] or rely on the
     * host's next render cycle to apply automatically.
     */
    fun submitSelectionOfTabsScreenWithKey(screenKey: String) {
        setPendingNavigationStateUpdate(
            TabsNavigationStateUpdateRequest(
                screenKey,
                navigationState.provenance,
                TabsActionOrigin.PROGRAMMATIC_NATIVE,
            ),
        )
    }

    /**
     * Apply any pending invalidations and state updates in a single coordinated pass.
     * No-op when nothing is dirty or the view is detached.
     */
    fun flushPendingUpdates() {
        if (invalidationFlags.any() && isAttachedToWindow) {
            performContainerUpdate()
        }
    }

    fun addNavigationStateObserver(observer: TabsNavigationStateObserver): Boolean = observerRegistry.add(observer)

    fun removeNavigationStateObserver(observer: TabsNavigationStateObserver): Boolean = observerRegistry.remove(observer)

    // endregion

    // region Host-internal API

    /**
     * Queue a navigation state update. Apply via [flushPendingUpdates] or rely on the
     * host's next render cycle to apply automatically.
     */
    internal fun setPendingNavigationStateUpdate(request: TabsNavigationStateUpdateRequest?) {
        pendingStateUpdateRequest = request
        invalidationFlags.isSelectedTabInvalidated = request != null
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

    internal fun setupFragmentManager() {
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }
    }

    internal fun teardownFragmentManager() {
        fragmentManager = null
    }

    /**
     * Idempotent teardown. Releases observer references and clears any pending operation.
     * Called by the host on view lifecycle end. Note: named `tearDown` (not `invalidate`) to avoid
     * shadowing [android.view.View.invalidate].
     */
    internal fun tearDown() {
        observerRegistry.clear()
        setPendingNavigationStateUpdate(null)
    }

    // endregion

    // region View lifecycle / insets / appearance

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsContainer [$id] attached to window")

        super.onAttachedToWindow()
        setupFragmentManager()
        flushPendingUpdates()

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

    override fun getInterfaceInsets(): EdgeInsets = EdgeInsets(0.0f, 0.0f, 0.0f, bottomNavigationView.height.toFloat())

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.removeColorSchemeListener(listener)

    // endregion

    // region TabsScreenDelegate impl

    override fun onAppearanceChanged(tabsScreen: TabsScreen) {
        if (selectedTab.tabsScreen === tabsScreen) {
            invalidationFlags.isNavigationMenuAppearanceInvalidated = true
            post {
                this.flushPendingUpdates()
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

    override fun onFragmentConfigurationChange(
        tabsScreen: TabsScreen,
        config: Configuration,
    ) {
        this.onConfigurationChanged(config)
    }

    // endregion

    // region Private helpers

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
        if (pendingStateUpdateRequest == null) {
            RNSLog.w(TAG, "TabsContainer::performOperation called w/o pending operation; skipping update")
            return
        }

        val stateUpdateRequest = requirePendingStateUpdateRequest()

        val nextSelectedMenuItemId =
            checkNotNull(getMenuItemIdForFragment(requireFragmentForScreenKey(stateUpdateRequest.selectedScreenKey))) {
                "[RNScreens] Failed to find Menu Item for screenKey: ${stateUpdateRequest.selectedScreenKey}"
            }

        if (rejectStaleNavigationStateUpdates && isNavigationStateStale(stateUpdateRequest)) {
            observerRegistry.emitOnNavigationStateUpdateRejected(
                navState,
                stateUpdateRequest,
                TabsNavigationStateRejectionReason.STALE,
            )
            pendingStateUpdateRequest = null
            return
        }

        if (bottomNavigationView.selectedItemId != nextSelectedMenuItemId || navState.isEmpty()) {
            isInExternalOperationContext = true
            // This triggers on OnMenuItemClicked callback, where we perform actual update from
            bottomNavigationView.selectedItemId = nextSelectedMenuItemId
            isInExternalOperationContext = false
        } else {
            observerRegistry.emitOnNavigationStateUpdateRejected(
                navState,
                stateUpdateRequest,
                TabsNavigationStateRejectionReason.REPEATED,
            )
        }

        pendingStateUpdateRequest = null
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

    private fun updateSelectedFragment(
        nextSelectedFragment: TabsScreenFragment,
        actionOrigin: TabsActionOrigin,
    ): Boolean {
        if (navState.isEmpty()) {
            check(isInExternalOperationContext && pendingStateUpdateRequest != null)
            navState = TabsNavigationState(nextSelectedFragment.requireScreenKey, 0)
            requireFragmentManager
                .createTransactionWithReordering()
                .add(contentView.id, nextSelectedFragment)
                .commitNowAllowingStateLoss()
            return true
        }

        val currentSelectedFragment = selectedTab

        if (nextSelectedFragment === currentSelectedFragment) {
            progressNavigationState(navState.selectedScreenKey, actionOrigin)
            return true
        }

        progressNavigationState(nextSelectedFragment.requireScreenKey, actionOrigin)
        requireFragmentManager
            .createTransactionWithReordering()
            .let {
                it.remove(currentSelectedFragment)
                it.add(contentView.id, nextSelectedFragment)
            }.commitNowAllowingStateLoss()

        return true
    }

    private fun progressNavigationState(
        selectedScreenKey: String,
        actionOrigin: TabsActionOrigin,
    ) {
        navState = TabsNavigationState(selectedScreenKey, navState.provenance + 1)
        if (actionOrigin != TabsActionOrigin.PROGRAMMATIC_JS) {
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

        val actionOrigin =
            if (isInExternalOperationContext) {
                requirePendingStateUpdateRequest().actionOrigin
            } else {
                TabsActionOrigin.USER
            }

        // If this is user action we test whether it should be prevented before we progress the state.
        if (!isRepeated && actionOrigin == TabsActionOrigin.USER && nextSelectedFragment.isPreventNativeSelectionEnabled) {
            observerRegistry.emitOnNavigationStateUpdatePrevented(navState, nextSelectedFragment.requireScreenKey)
            return false
        }

        val stateChanged = updateSelectedFragment(nextSelectedFragment, actionOrigin)

        val hasTriggeredSpecialEffect =
            if (isRepeated) specialEffectsHandler.handleRepeatedTabSelection() else false

        if (stateChanged) {
            observerRegistry.emitOnNavigationStateUpdate(
                navState,
                isRepeated = isRepeated,
                hasTriggeredSpecialEffect = hasTriggeredSpecialEffect,
                actionOrigin = actionOrigin,
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
            .indexOfFirst { it.requireScreenKey == navState.selectedScreenKey }
            .takeIf { it != -1 }

    private fun getMenuItemForTabsScreen(tabsScreen: TabsScreen): MenuItem? =
        tabsModel
            .indexOfFirst { it.tabsScreen === tabsScreen }
            .takeIf { it != -1 }
            ?.let { index ->
                bottomNavigationView.menu.findItem(menuItemIdForFragmentAtIndex(index))
            }

    private fun getFragmentForScreenKey(screenKey: String): TabsScreenFragment? = tabsModel.find { it.requireScreenKey == screenKey }

    private fun requireFragmentForScreenKey(screenKey: String): TabsScreenFragment =
        checkNotNull(getFragmentForScreenKey(screenKey)) {
            "[RNScreens] Requested fragment for key: $screenKey does not exist"
        }

    private fun updateInterfaceInsets(newHeight: Int? = null) {
        val height = if (tabBarHidden) 0 else (newHeight ?: bottomNavigationView.height)

        interfaceInsetsChangeListener?.apply {
            this.onInterfaceInsetsChange(EdgeInsets(0.0f, 0.0f, 0.0f, height.toFloat()))
        }
    }

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

    private fun isNavigationStateStale(request: TabsNavigationStateUpdateRequest): Boolean {
        if (navState.isEmpty() || lastUINavState.isEmpty()) return false
        return request.baseProvenance < lastUINavState.provenance
    }

    // endregion

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
