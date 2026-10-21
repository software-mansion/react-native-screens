package com.swmansion.rnscreens.core.containers.tabs.container

import android.view.Menu
import android.view.MenuItem
import com.swmansion.rnscreens.core.containers.tabs.item.TabsScreenFragment

internal fun Menu.findMenuItemForFragment(fragment: TabsScreenFragment): MenuItem? = this.findItem(fragment.menuItemId)

internal fun Menu.requireMenuItemForFragment(fragment: TabsScreenFragment): MenuItem =
    checkNotNull(findMenuItemForFragment(fragment)) { "[RNScreens] Missing MenuItem for id: ${fragment.menuItemId}" }

internal fun Menu.getOrCreateMenuItemForFragment(fragment: TabsScreenFragment): MenuItem =
    findMenuItemForFragment(fragment) ?: this.add(
        Menu.NONE,
        fragment.menuItemId,
        Menu.NONE,
        fragment.item.tabTitle,
    )
