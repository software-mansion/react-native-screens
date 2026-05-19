package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions

interface StackHeaderConfigDelegate {
    fun onConfigChange(config: StackHeaderConfigProviding)

    fun onMenuItemUpdate(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    )
}
