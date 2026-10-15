package com.swmansion.rnscreens.tabs.appearance

import com.swmansion.rnscreens.tabs.screen.TabsItemInvalidationFlags

/**
 * What the tab bar has yet to apply to, and has applied to, a single menu item.
 *
 * A fresh state is fully dirty by construction: nothing of the tab has been applied to the
 * menu item yet, regardless of what an earlier menu item for the same tab consumed.
 */
internal class TabsMenuItemState {
    var pendingFlags = TabsItemInvalidationFlags.ALL

    var appliedActiveIndicatorWidthPx: Int? = null

    var appliedActiveIndicatorHeightPx: Int? = null
}
