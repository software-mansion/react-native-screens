package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.update.StackHeaderToolbarMenuElementUpdate

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)

    fun onMenuElementsUpdated(updates: List<StackHeaderToolbarMenuElementUpdate>)
}
