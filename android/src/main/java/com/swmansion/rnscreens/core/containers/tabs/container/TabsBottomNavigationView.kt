package com.swmansion.rnscreens.core.containers.tabs.container

import android.content.Context
import android.view.MenuItem
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.core.containers.tabs.item.TabsItemInvalidationFlags

/**
 * The tab bar of [TabsContainer]. Hosts may subclass it to integrate with their view system;
 * the container creates it through the factory it is given.
 */
open class TabsBottomNavigationView(
    context: Context,
) : BottomNavigationView(context) {
    internal fun findMenuItem(menuItemId: Int): MenuItem? = menu.findItem(menuItemId)

    internal fun requireMenuItem(menuItemId: Int): MenuItem =
        checkNotNull(findMenuItem(menuItemId)) { "[RNScreens] Missing MenuItem for id: $menuItemId" }

    // region Menu item state

    private val menuItemStates = HashMap<Int, TabsMenuItemState>()

    internal fun menuItemState(menuItemId: Int): TabsMenuItemState = menuItemStates.getOrPut(menuItemId) { TabsMenuItemState() }

    internal fun invalidateMenuItem(
        menuItemId: Int,
        flags: TabsItemInvalidationFlags,
    ) {
        val state = menuItemState(menuItemId)
        state.pendingFlags = state.pendingFlags or flags
    }

    internal fun invalidateAllMenuItems(flags: TabsItemInvalidationFlags) {
        menuItemStates.values.forEach { it.pendingFlags = it.pendingFlags or flags }
    }

    /**
     * Rebuilt menu items have nothing applied, so their fresh states are fully dirty. This also drops
     * the states of removed tabs.
     */
    internal fun resetMenuItemStates() {
        menuItemStates.clear()
    }

    // endregion
}
