package com.swmansion.rnscreens.stack.header.toolbar.update

import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemIconSource

/**
 * A single toolbar menu element update carried by an `updateToolbarMenuElements`
 * view command, before its icon (if any) has been resolved. `checked` travels
 * outside [options]: it mutates group selections rather than the item itself.
 */
internal data class StackHeaderToolbarMenuElementRawUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
    val iconSource: StackHeaderToolbarMenuItemIconSource?,
    val checked: Boolean?,
)
