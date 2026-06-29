package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)

    fun onMenuItemUpdated(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    )
}
