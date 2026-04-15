package com.swmansion.rnscreens.gamma.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.tabs.container.TabsContainer
import com.swmansion.rnscreens.gamma.tabs.container.menuItemIdForFragmentAtIndex
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView)

    fun updateTabAppearance(
        context: Context,
        tabsContainer: TabsContainer,
    ) {
        val selectedTabAppearance = tabsContainer.selectedTab.tabsScreen.appearance
        appearanceApplicator.updateSharedAppearance(context, selectedTabAppearance, tabsContainer.tabBarHidden)
        updateMenuItems(context, selectedTabAppearance)
        appearanceApplicator.updateFontStyles(context, selectedTabAppearance) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(
        context: Context,
        tabsAppearance: TabsAppearance?,
    ) {
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val menuItemId = menuItemIdForFragmentAtIndex(index)
            val menuItem =
                checkNotNull(bottomNavigationView.menu.findItem(menuItemId)) {
                    "[RNScreens] Missing MenuItem for id: $menuItemId"
                }
            check(menuItem.itemId == menuItemId) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(context, menuItem, fragment.tabsScreen, tabsAppearance)
        }
    }

    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, tabsScreen, appearance)
    }
}
