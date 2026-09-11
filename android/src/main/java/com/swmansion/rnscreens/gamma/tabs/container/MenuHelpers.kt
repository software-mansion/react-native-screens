package com.swmansion.rnscreens.gamma.tabs.container

import android.view.Menu
import android.view.MenuItem
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

internal fun Menu.getOrCreateMenuItemForFragment(fragment: TabsScreenFragment): MenuItem =
    this.findItem(fragment.menuItemId) ?: this.add(
        Menu.NONE,
        fragment.menuItemId,
        Menu.NONE,
        fragment.tabsScreen.tabTitle,
    )
