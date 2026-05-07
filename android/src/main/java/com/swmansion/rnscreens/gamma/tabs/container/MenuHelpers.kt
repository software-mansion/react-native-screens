package com.swmansion.rnscreens.gamma.tabs.container

import android.view.Menu
import android.view.MenuItem
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen

// MenuItem ids are offset by one, because 0 has special meaning in the BottomNavigationMenuView API.

/**
 * Compute MenuItem id for a fragment at given index in "tabsModel" of TabsContainer
 */
internal fun menuItemIdForFragmentAtIndex(fragmentIndex: Int): Int = fragmentIndex + 1

/**
 * Compute fragment index in "tabsModel" of TabsContainer for a MenuItem with given id.
 */
internal fun fragmentIndexForMenuItemId(menuItemId: Int): Int {
    check(menuItemId >= 1) { "[RNScreens] MenuItem id must not be less than 1" }
    return menuItemId - 1
}

internal fun Menu.getOrCreateMenuItemForFragmentAt(
    index: Int,
    tabsScreen: TabsScreen,
): MenuItem =
    this.findItem(menuItemIdForFragmentAtIndex(index)) ?: this.add(
        Menu.NONE,
        menuItemIdForFragmentAtIndex(index),
        Menu.NONE,
        tabsScreen.tabTitle,
    )
