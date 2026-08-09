package com.swmansion.rnscreens.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.tabs.container.TabsContainer
import com.swmansion.rnscreens.tabs.container.menuItemIdForFragmentAtIndex
import com.swmansion.rnscreens.tabs.screen.TabsScreen
import com.swmansion.rnscreens.tabs.screen.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView)

    // Icon box is bar-wide: the largest effective size across tabs.
    private fun resolveIconBoxDp(): Float =
        tabsScreenFragments.maxOfOrNull { appearanceApplicator.effectiveIconSizeDp(it.tabsScreen) }
            ?: appearanceApplicator.defaultIconSizeDp

    fun updateTabAppearance(
        context: Context,
        tabsContainer: TabsContainer,
    ) {
        val selectedTabAppearance = tabsContainer.selectedTab.tabsScreen.appearance
        val iconBoxDp = resolveIconBoxDp()
        appearanceApplicator.applyIconBox(iconBoxDp)
        appearanceApplicator.updateSharedAppearance(context, selectedTabAppearance, tabsContainer.tabBarHidden, iconBoxDp)
        updateMenuItems(context, selectedTabAppearance, iconBoxDp)
        appearanceApplicator.updateFontStyles(context, selectedTabAppearance) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(
        context: Context,
        tabsAppearance: TabsAppearance?,
        iconBoxDp: Float,
    ) {
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val menuItemId = menuItemIdForFragmentAtIndex(index)
            val menuItem =
                checkNotNull(bottomNavigationView.menu.findItem(menuItemId)) {
                    "[RNScreens] Missing MenuItem for id: $menuItemId"
                }
            check(menuItem.itemId == menuItemId) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(context, menuItem, fragment.tabsScreen, tabsAppearance, iconBoxDp)
        }
    }

    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
        iconBoxDp: Float = resolveIconBoxDp(),
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen, iconBoxDp)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, tabsScreen, appearance)
    }
}
