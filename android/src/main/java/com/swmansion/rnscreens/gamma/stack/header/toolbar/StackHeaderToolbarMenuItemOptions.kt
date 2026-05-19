package com.swmansion.rnscreens.gamma.stack.header.toolbar

/**
 * Partial update for a toolbar menu item.
 *
 * A `null` field means "leave the current value unchanged". A non-null field
 * replaces the current value on the underlying `MenuItem`.
 *
 * The JS layer represents "reset to default" by sending an explicit `null`
 * over the bridge; the view manager folds that into the corresponding default
 * from [StackHeaderToolbarMenuItemDefaults] before constructing this type, so
 * by the time it reaches the coordinator a non-null value is always an
 * effective value to apply verbatim.
 */
data class StackHeaderToolbarMenuItemOptions(
    val title: String? = null,
    val hidden: Boolean? = null,
)
