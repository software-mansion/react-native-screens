package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuElementUpdate

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)

    /**
     * Applies a fully-resolved batch of toolbar menu element updates atomically. The
     * batch has already had its icons resolved by the toolbar menu update queue, so all
     * elements — including any that loaded images — arrive together. Selection
     * changes are coalesced to at most one event per affected group.
     */
    fun onMenuElementsUpdated(updates: List<StackHeaderToolbarMenuElementUpdate>)
}
