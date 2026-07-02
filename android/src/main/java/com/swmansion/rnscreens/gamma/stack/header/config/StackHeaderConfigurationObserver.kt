package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuElementOptions

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)

    fun onMenuElementUpdated(
        id: String,
        options: StackHeaderToolbarMenuElementOptions,
    )
}
