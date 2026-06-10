package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions

interface StackHeaderConfigurationObserver {
    fun onConfigChanged(
        config: StackHeaderConfigurationProviding,
        flags: StackHeaderUpdateFlags,
    )

    fun onMenuItemUpdate(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    )
}
