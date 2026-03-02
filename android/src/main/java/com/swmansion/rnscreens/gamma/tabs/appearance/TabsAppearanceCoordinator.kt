package com.swmansion.rnscreens.gamma.tabs.appearance

import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.size
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.tabs.host.TabsHost
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

class TabsAppearanceCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView)

    fun updateTabAppearance(
        context: ContextThemeWrapper,
        tabsHost: TabsHost,
    ) {
        appearanceApplicator.updateSharedAppearance(context, tabsHost)
        updateMenuItems(context, tabsHost)
        appearanceApplicator.updateFontStyles(context, tabsHost) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(
        context: ContextThemeWrapper,
        tabsHost: TabsHost,
    ) {
        if (bottomNavigationView.menu.size != tabsScreenFragments.size) {
            // Most likely first render or some tab has been removed. Let's nuke the menu (easiest option).
            bottomNavigationView.menu.clear()
        }
        val appearance = tabsHost.currentFocusedTab.tabsScreen.appearance
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val menuItem = bottomNavigationView.menu.getOrCreateMenuItem(index, fragment.tabsScreen)
            check(menuItem.itemId == index) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(context, menuItem, fragment.tabsScreen, appearance)
        }
    }

    internal fun updateMenuItemAppearance(
        context: ContextThemeWrapper,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, tabsScreen, appearance)
    }
}

private fun Menu.getOrCreateMenuItem(
    index: Int,
    tabsScreen: TabsScreen,
): MenuItem = this.findItem(index) ?: this.add(Menu.NONE, index, Menu.NONE, tabsScreen.tabTitle)
