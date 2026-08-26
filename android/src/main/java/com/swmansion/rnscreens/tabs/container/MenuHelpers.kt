package com.swmansion.rnscreens.tabs.container

import android.view.Menu
import android.view.MenuItem
import com.swmansion.rnscreens.tabs.screen.TabsScreenFragment

internal fun Menu.getOrCreateMenuItemForFragment(fragment: TabsScreenFragment): MenuItem =
    this.findItem(fragment.menuItemId) ?: this.add(
        Menu.NONE,
        fragment.menuItemId,
        Menu.NONE,
        fragment.tabsScreen.tabTitle,
    )

internal fun Menu.indexOfItem(item: MenuItem): Int {
    // We can iterate because we know that there are a few items at most
    for (i in 0 until size()) {
        if (getItem(i) === item) return i
    }
    return -1
}


