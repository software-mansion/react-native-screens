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
internal class TabsContainer(private val context: Context,
                             internal val tabsHost: TabsHost // TODO: TEMPORARY, REMOVE THIS DEPENDENCY
) : FrameLayout(context), ColorSchemeProviding,
    TabsScreenDelegate,
    SafeAreaProvider,
    View.OnLayoutChangeListener
{

    init {
        id = ViewIdGenerator.generateViewId()
    }

    private inner class SpecialEffectsHandler {
        fun handleRepeatedTabSelection(): Boolean {
            val contentView = this@TabsContainer.contentView
            val selectedTabFragment = this@TabsContainer.currentFocusedTab
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

//    private var navState: TabsNavState = TabsNavState("", Int.MIN_VALUE)
    // TODO: AFTER REFACTOR COMPLETES, THIS SHOULD BE PRIVATE
    internal val tabsModel: MutableList<TabsScreenFragment> = arrayListOf()
    internal val currentFocusedTab: TabsScreenFragment
        get() = checkNotNull(tabsModel.find { it.tabsScreen.isFocusedTab }) { "[RNScreens] No focused tab present" }

    internal val invalidationFlags = TabsContainerInvalidationFlags()

    private var pendingOperation: TabsContainerOp? = null
    internal val hasPendingOperation
        get() = pendingOperation != null

    private var fragmentManager: FragmentManager? = null
    private val requireFragmentManager: FragmentManager
        get() = checkNotNull(fragmentManager) { "[RNScreens] Attempt to use nullish FragmentManager" }

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    internal val bottomNavigationView: BottomNavigationView =
        BottomNavigationView(wrappedContext).apply {
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
            invalidationFlags.isBottomNavigationMenuInvalidated = true
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
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "TabsContainer [$id] attached to window")

        super.onAttachedToWindow()

        setupFragmentManger()

        colorSchemeCoordinator.setup(this) { uiNightMode ->
            applyDayNightUiMode(uiNightMode)
        }

        performContainerUpdateIfNeeded()
//        containerUpdateCoordinator.let {
//            it.invalidateAll()
//            it.runContainerUpdate()
//        }
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
    }

    internal fun performContainerUpdateIfNeeded() {
        if (invalidationFlags.any() && isAttachedToWindow) {
            performContainerUpdate()
        }
    }

    private fun performContainerUpdate() {
        if (invalidationFlags.isSelectedTabInvalidated) {
            invalidationFlags.isSelectedTabInvalidated = false
            this.updateSelectedTab()
        }
        if (invalidationFlags.isBottomNavigationMenuInvalidated) {
            invalidationFlags.isBottomNavigationMenuInvalidated = false
            this.updateBottomNavigationViewAppearance()
            a11yCoordinator.setA11yPropertiesToAllTabItems()
        }
        performOperation()
    }

    private fun performOperation() {
        if (pendingOperation == null) {
            return
        }

        pendingOperation = null
    }

    private fun updateBottomNavigationViewAppearance() {
        RNSLog.d(TabsHost.Companion.TAG, "updateBottomNavigationViewAppearance")

        appearanceCoordinator.updateTabAppearance(wrappedContext, tabsHost)

        val selectedTabsScreenFragmentId =
            checkNotNull(getSelectedTabsScreenFragmentId()) { "[RNScreens] A single selected tab must be present" }
        if (bottomNavigationView.selectedItemId != selectedTabsScreenFragmentId) {
            bottomNavigationView.selectedItemId = selectedTabsScreenFragmentId
        }

        post {
//            refreshLayout()
            requestLayout()
            RNSLog.d(TabsHost.Companion.TAG, "BottomNavigationView request layout")
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

    private fun onMenuItemSelected(item: MenuItem): Boolean {
        RNSLog.d(TabsHost.Companion.TAG, "Item selected $item")

        val fragment = getFragmentForMenuItemId(item.itemId)

        val repeatedSelectionHandledBySpecialEffect =
            if (fragment == currentFocusedTab) specialEffectsHandler.handleRepeatedTabSelection() else false

        val screenKey = fragment?.tabsScreen?.screenKey ?: "undefined"

        tabsHost.eventEmitter.emitOnNativeFocusChange(
            screenKey,
            item.itemId,
            repeatedSelectionHandledBySpecialEffect,
        )
        return true
    }

    private fun applyDayNightUiMode(uiMode: Int) {
        // update the appearance when user toggles between dark/light mode
        when (uiMode) {
            Configuration.UI_MODE_NIGHT_YES -> {
                wrappedContext.setTheme(R.style.Theme_Material3_Dark_NoActionBar)
            }

            Configuration.UI_MODE_NIGHT_NO -> {
                wrappedContext.setTheme(R.style.Theme_Material3_Light_NoActionBar)
            }

            else -> {
                wrappedContext.setTheme(R.style.Theme_Material3_DayNight_NoActionBar)
            }
        }

        appearanceCoordinator.updateTabAppearance(wrappedContext, tabsHost)
    }

    private fun getFragmentForMenuItemId(itemId: Int): TabsScreenFragment? = tabsModel.getOrNull(itemId)

    private fun getSelectedTabsScreenFragmentId(): Int? {
        if (tabsModel.isEmpty()) {
            return null
        }
        return checkNotNull(tabsModel.indexOfFirst { it.tabsScreen.isFocusedTab }) { "[RNScreens] There must be a focused tab" }
    }

    private fun getMenuItemForTabsScreen(tabsScreen: TabsScreen): MenuItem? =
        tabsModel
            .indexOfFirst { it.tabsScreen === tabsScreen }
            .takeIf { it != -1 }
            ?.let { index ->
                bottomNavigationView.menu.findItem(index)
            }

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.removeColorSchemeListener(listener)

    override fun onAppearanceChanged(tabsScreen: TabsScreen) {
        if (tabsScreen.isFocusedTab) {
            invalidationFlags.isBottomNavigationMenuInvalidated = true
            post {
                this.performContainerUpdateIfNeeded()
            }
//            containerUpdateCoordinator.let {
//                it.invalidateNavigationMenu()
//                it.postContainerUpdateIfNeeded()
//            }
        }
    }

    override fun onTabFocusChangedFromJS(
        tabsScreen: TabsScreen,
        isFocused: Boolean,
    ) {
        invalidationFlags.invalidateAll()
        post {
            this.performContainerUpdateIfNeeded()
        }
//        containerUpdateCoordinator.let {
//            it.invalidateAll()
//            it.postContainerUpdateIfNeeded()
//        }
    }

    override fun onMenuItemAttributesChange(tabsScreen: TabsScreen) {
        getMenuItemForTabsScreen(tabsScreen)?.let { menuItem ->
            val appearance = currentFocusedTab.tabsScreen.appearance
            appearanceCoordinator.updateMenuItemAppearance(wrappedContext, menuItem, tabsScreen, appearance)
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

    internal fun setupFragmentManger() {
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }
    }

    internal fun teardownFragmentManager() {
        fragmentManager = null
    }

    companion object {
        const val TAG = "TabsContainer"
    }
}

internal class TabsContainerInvalidationFlags(
    var isSelectedTabInvalidated: Boolean = false,
    var isBottomNavigationMenuInvalidated: Boolean = false
) {
    internal fun any(): Boolean = isSelectedTabInvalidated || isBottomNavigationMenuInvalidated

    internal fun invalidateAll() {
        isSelectedTabInvalidated = true
        isBottomNavigationMenuInvalidated = true
    }
}