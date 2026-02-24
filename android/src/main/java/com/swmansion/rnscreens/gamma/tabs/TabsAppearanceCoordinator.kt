package com.swmansion.rnscreens.gamma.tabs.host

import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.size
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.tabs.AndroidTabsAppearance
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

class TabsAppearanceCoordinator(
    context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(context, bottomNavigationView)

    fun updateTabAppearance(tabsHost: TabsHost) {
        appearanceApplicator.updateSharedAppearance(tabsHost)
        updateMenuItems(tabsHost)
        appearanceApplicator.updateFontStyles(tabsHost) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(tabsHost: TabsHost) {
        if (bottomNavigationView.menu.size != tabsScreenFragments.size) {
            // Most likely first render or some tab has been removed. Let's nuke the menu (easiest option).
            bottomNavigationView.menu.clear()
        }
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val appearance = tabsHost.currentFocusedTab.tabsScreen.appearance
            val menuItem = bottomNavigationView.menu.getOrCreateMenuItem(index, fragment.tabsScreen)
            check(menuItem.itemId == index) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(menuItem, fragment.tabsScreen, appearance)
        }
    }

    internal fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: AndroidTabsAppearance?,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen)
        appearanceApplicator.updateBadgeAppearance(menuItem, tabsScreen, appearance?.badge)
    }
}

private fun Menu.getOrCreateMenuItem(
    index: Int,
    tabsScreen: TabsScreen,
): MenuItem = this.findItem(index) ?: this.add(Menu.NONE, index, Menu.NONE, tabsScreen.tabTitle)
