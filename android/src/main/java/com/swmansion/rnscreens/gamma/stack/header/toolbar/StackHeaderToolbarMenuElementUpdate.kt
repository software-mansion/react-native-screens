package com.swmansion.rnscreens.gamma.stack.header.toolbar

/**
 * A single toolbar menu element update whose icon has already been resolved and merged
 * into [options], ready to be applied to the toolbar.
 */
internal data class StackHeaderToolbarMenuElementUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
)
