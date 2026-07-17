package com.swmansion.rnscreens.gamma.stack.header.toolbar.update

import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuItemIconSource

/**
 * A single toolbar menu element update carried by an `updateToolbarMenuElements`
 * view command, before its icon (if any) has been resolved.
 */
internal data class StackHeaderToolbarMenuElementRawUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
    val iconSource: StackHeaderToolbarMenuItemIconSource?,
)
