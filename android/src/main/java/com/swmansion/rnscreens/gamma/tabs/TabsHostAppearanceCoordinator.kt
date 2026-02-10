package com.swmansion.rnscreens.gamma.tabs

import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.size
import com.google.android.material.bottomnavigation.BottomNavigationView

class TabsHostAppearanceCoordinator(
    context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
    private val tabScreenFragments: MutableList<TabScreenFragment>,
) {
    private val appearanceApplicator = TabsHostAppearanceApplicator(context, bottomNavigationView)

    fun updateTabAppearance(tabsHost: TabsHost) {
        appearanceApplicator.updateSharedAppearance(tabsHost)
        updateMenuItems()
        appearanceApplicator.updateFontStyles(tabsHost) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems() {
        if (bottomNavigationView.menu.size != tabScreenFragments.size) {
            // Most likely first render or some tab has been removed. Let's nuke the menu (easiest option).
            bottomNavigationView.menu.clear()
        }
        tabScreenFragments.forEachIndexed { index, fragment ->
            val menuItem = bottomNavigationView.menu.getOrCreateMenuItem(index, fragment.tabScreen)
            check(menuItem.itemId == index) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(menuItem, fragment.tabScreen)
        }
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabScreen)
        appearanceApplicator.updateBadgeAppearance(menuItem, tabScreen)
    }
}

private fun Menu.getOrCreateMenuItem(
    index: Int,
    tabScreen: TabScreen,
): MenuItem = this.findItem(index) ?: this.add(Menu.NONE, index, Menu.NONE, tabScreen.tabTitle)
