package com.swmansion.rnscreens.gamma.stack.header.toolbar

/**
 * Partial update for a toolbar menu item.
 *
 * A `null` field means "leave the current value unchanged". A non-null field
 * replaces the current value on the underlying `MenuItem`.
 */
data class StackHeaderToolbarMenuItemOptions(
    val title: String? = null,
    val hidden: Boolean? = null,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction? = null,
)
