package com.swmansion.rnscreens.stack.header.toolbar.update

/**
 * Receives a fully-resolved batch of menu element updates, to be applied to the toolbar
 * atomically.
 */
internal fun interface StackHeaderToolbarMenuUpdateQueueDelegate {
    fun onUpdatesResolved(updates: List<StackHeaderToolbarMenuElementUpdate>)
}
