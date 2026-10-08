package com.swmansion.rnscreens.gamma.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.tabs.container.TabsContainer
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView)

    private var appliedIconBoxDp: Float? = null

    // Icon box is bar-wide: the largest effective size across tabs.
    internal fun resolveIconBoxDp(): Float {
        if (tabsScreenFragments.isEmpty()) {
            return appearanceApplicator.defaultIconSizeDp
        }
        var largestIconDp = 0f
        var tallestIndicatorDp = 0f
        var shortestIndicatorDp = Float.MAX_VALUE
        tabsScreenFragments.forEach {
            largestIconDp = maxOf(largestIconDp, appearanceApplicator.effectiveIconSizeDp(it.tabsScreen))
            val indicatorHeightDp = appearanceApplicator.effectiveIndicatorHeightDp(it.tabsScreen)
            tallestIndicatorDp = maxOf(tallestIndicatorDp, indicatorHeightDp)
            shortestIndicatorDp = minOf(shortestIndicatorDp, indicatorHeightDp)
        }
        val unevenIndicatorsOutgrowIcons = tallestIndicatorDp > largestIconDp && tallestIndicatorDp != shortestIndicatorDp
        return if (unevenIndicatorsOutgrowIcons) tallestIndicatorDp else largestIconDp
    }

    internal fun invalidateMenuItemIcons() {
        tabsScreenFragments.forEach { it.tabsScreen.isMenuItemIconInvalidated = true }
    }

    internal fun invalidateRebuiltMenuItems() {
        invalidateMenuItemIcons()
        tabsScreenFragments.forEach {
            it.tabsScreen.isMenuItemActiveIndicatorInvalidated = true
            it.tabsScreen.appliedActiveIndicatorWidthPx = null
            it.tabsScreen.appliedActiveIndicatorHeightPx = null
        }
    }

    fun updateTabAppearance(
        context: Context,
        tabsContainer: TabsContainer,
    ) {
        val selectedTabAppearance = tabsContainer.selectedTab.tabsScreen.appearance
        val iconBoxDp = resolveIconBoxDp()
        if (iconBoxDp != appliedIconBoxDp) {
            appliedIconBoxDp = iconBoxDp
            invalidateMenuItemIcons()
        }
        appearanceApplicator.applyIconBox(iconBoxDp)
        appearanceApplicator.updateSharedAppearance(context, selectedTabAppearance, tabsContainer.tabBarHidden)
        updateMenuItems(context, selectedTabAppearance, iconBoxDp)
        appearanceApplicator.updateFontStyles(context, selectedTabAppearance) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(
        context: Context,
        tabsAppearance: TabsAppearance?,
        iconBoxDp: Float,
    ) {
        tabsScreenFragments.forEach { fragment ->
            val menuItemId = fragment.menuItemId
            val menuItem =
                checkNotNull(bottomNavigationView.menu.findItem(menuItemId)) {
                    "[RNScreens] Missing MenuItem for id: $menuItemId"
                }
            updateMenuItemAppearance(context, menuItem, fragment.tabsScreen, tabsAppearance, iconBoxDp)
        }
    }

    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
        iconBoxDp: Float,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen, iconBoxDp)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, tabsScreen, appearance)
    }
}
