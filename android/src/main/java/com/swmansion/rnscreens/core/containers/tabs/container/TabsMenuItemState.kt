package com.swmansion.rnscreens.core.containers.tabs.container

import com.swmansion.rnscreens.core.containers.tabs.item.TabsItemInvalidationFlags

/**
 * What the tab bar has yet to apply to, and has applied to, a single menu item. Owned by
 * [TabsBottomNavigationView], keyed by menu item id.
 *
 * A fresh state is fully dirty by construction: nothing of the tab has been applied to the
 * menu item yet, regardless of what an earlier menu item for the same tab consumed.
 */
internal class TabsMenuItemState {
    var pendingFlags = TabsItemInvalidationFlags.ALL

    /**
     * Returns the pending flags and clears them. The caller takes over applying all of them.
     */
    fun consumePendingFlags(): TabsItemInvalidationFlags = pendingFlags.also { pendingFlags = TabsItemInvalidationFlags.NONE }

    var appliedActiveIndicatorWidthPx: Int? = null

    var appliedActiveIndicatorHeightPx: Int? = null
}
