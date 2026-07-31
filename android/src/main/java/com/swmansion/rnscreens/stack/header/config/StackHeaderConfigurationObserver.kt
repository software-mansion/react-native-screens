package com.swmansion.rnscreens.stack.header.config

import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementUpdate

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)

    fun onMenuElementsUpdated(updates: List<StackHeaderToolbarMenuElementUpdate>)
}
