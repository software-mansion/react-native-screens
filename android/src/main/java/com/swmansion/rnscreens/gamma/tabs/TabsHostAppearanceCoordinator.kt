package com.swmansion.rnscreens.gamma.tabs

import android.view.Menu
import android.view.MenuItem
import android.view.ViewGroup
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
        val activeTabScreen = tabsHost.currentFocusedTab.tabScreen

        appearanceApplicator.updateSharedAppearance(tabsHost, activeTabScreen)
        updateMenuItems(tabsHost)
        appearanceApplicator.updateFontStyles(tabsHost, activeTabScreen) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(tabsHost: TabsHost) {
        if (bottomNavigationView.menu.size != tabScreenFragments.size) {
            // Most likely first render or some tab has been removed. Let's nuke the menu (easiest option).
            bottomNavigationView.menu.clear()
        }

        tabScreenFragments.forEachIndexed { index, fragment ->
            val activeTabScreen = tabsHost.currentFocusedTab.tabScreen
            val menuItem = bottomNavigationView.menu.getOrCreateMenuItem(index, fragment.tabScreen)
            check(menuItem.itemId == index) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(menuItem, fragment.tabScreen, activeTabScreen)

            setupTabFocusListener(index, menuItem, tabsHost, fragment.tabScreen)
        }
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
        activeTabScreen: TabScreen,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabScreen)
        appearanceApplicator.updateBadgeAppearance(menuItem, tabScreen, activeTabScreen)
    }

    private fun setupTabFocusListener(
        index: Int,
        menuItem: MenuItem,
        tabsHost: TabsHost,
        tabScreen: TabScreen,
    ) {
        val menuView = bottomNavigationView.getChildAt(0) as? ViewGroup ?: return
        val itemView = menuView.getChildAt(index)
        val badge = bottomNavigationView.getBadge(menuItem.itemId)

        if (itemView == null || badge == null) {
            return
        }

        if (itemView.onFocusChangeListener == null) {
            itemView.setOnFocusChangeListener { _, hasFocus ->
                val activeTabScreen = tabsHost.currentFocusedTab.tabScreen
                appearanceApplicator.updateSharedAppearance(tabsHost, activeTabScreen)
                appearanceApplicator.updateFontStyles(tabsHost, activeTabScreen)
                appearanceApplicator.updateBadgeStyle(
                    badge,
                    hasFocus,
                    tabScreen,
                    activeTabScreen,
                    menuItem
                )
            }
        }
    }

    companion object {
        const val TAG = "TabsHostAppearanceCoordinator"
    }
}

private fun Menu.getOrCreateMenuItem(
    index: Int,
    tabScreen: TabScreen,
): MenuItem = this.findItem(index) ?: this.add(Menu.NONE, index, Menu.NONE, tabScreen.tabTitle)
